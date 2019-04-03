---
title: RMarkdown 101
subtitle: RMarkdown is amazing. But how to use it? 
author: Jacques Serizay
date: 2018-11-23
slug: Rmarkdown_101
categories:
    - R
    - markdown
tags:
    - R
    - markdown
header:
    caption: ''
    image: ''
summary: "Rmarkdown is amazing for reproducible research."
---

Let's got back to the time when I discovered the power of using Markdown. I immediatly started writing everything in Markdown. EVERYTHING. And that was great! How easy it was to produce a high-quality, well-formatted report! Those were good, early times.  
\n
And then, RStudio devs came along and started working on Rmarkdown. Wow! I as blazed. Combining both worlds, really?! I love R, for all its well-developed packages and its vibrant community. And I use it literally every day. So I was thrilled. And very excited to see how things would turn out. And they turned out great, that's for sure. There is no need today to remind how much Rmarkdown continuously improves the reproducibility of the research. I don't use Python that much, and I felt quite jealous of Jupyter notebooks, until Rmarkdown came out.  
\n
So just for the purpose of showing why Rmarkdown is so amazing, here is some code that I regularly run, to get some information about gene expression in the data I generated during my PhD.  

```{r setup, echo = F, error = F, message = F, warning = F}
    knitr::opts_chunk$set(tidy = T)
    # Additional functions
    sort.per.clusters <- function(df, clusters) {
        df2 <- df[0,]
        for (cluster in unique(clusters)) {
            tmp <- df[clusters == cluster, ]
            which.max.col <- which.max(colSums(tmp))
            tmp <- tmp[order(tmp[,which.max.col], decreasing = T),]
            df2 <- rbind(df2, tmp)
        }
        colnames(df2) <- colnames(df)
        return(df2)
    }
    clamp <- function(df, lims = c(-99999, 99999)) {
        df2 <- as.data.frame(df)
        df2[df2 < lims[1]] <- lims[1]
        df2[df2 > lims[2]] <- lims[2]
        return(df2)
    }
    .sourceDirs() # This load my custom functions 
    library(tidyverse)
    library(magrittr)
    library(pheatmap)
```

```{r}
    load('~/Documents/PhD/__Bioinfo/shared/data/classification_tissue-spe-genes-REs.RData') # This load my gene expression datasets
    # Here is the list of genes enriched in germline tissue:
    genes.gtf %>% 
    '['(.$which.tissues == 'Germline') %>% 
    names() -> germline.genes
    str(germline.genes)
```

So we can extract lists of genes, and even export it, by simply running `writeLines(germline.genes, con = 'genes-list.txt')`. Wow, easy! But can we look a little bit more into the details?  

```{r}
    # Let's have a look at what the expression of our genes look like during development: 
    LCAPdev %>%
    '['(germline.genes,) %>% 
    apply(., 1, scale) %>% 
    t() -> developmental.expression
    colnames(developmental.expression) <- c('emb', 'L1', 'L2', 'L3', 'L4', 'YA')
    
    # And now let's plot the results!
    cols <- colorRampPalette(c('darkblue', 'white', 'orange', 'darkred'))(50)
    breaks <- seq(-1, 2, length.out = length(cols) + 1)
    clamped.developmental.expression <- clamp(developmental.expression, c(-2, 2))
    pheatmap(  
        clamped.developmental.expression,  
        cluster_cols = F,  
        main = 'Expression of germline genes during development',  
        show_rownames = F, 
        breaks = breaks,  
        color = cols,  
        scale = 'none' 
    )
```

Looks ok, but can we do better? For example, the rows are automatically reorganized by hierarchical clustering. But we can see that there seem to be 3 major groups of germline genes. Let's see if we can cluster using a k-means approach and see whether this improves the resulting heatmap.  

```{r}
    # We can identify the clusters in our data with k-means
    clusters <- kmeans(developmental.expression, centers = 3)$cluster
    ranked.developmental.expression <- sort.per.clusters(developmental.expression, clusters)

    # And re-plot our heatmap
    clamped.developmental.expression <- clamp(ranked.developmental.expression, c(-2, 2))
    pheatmap(
        clamped.developmental.expression, 
        cluster_cols = F,  
        cluster_rows = F,  
        main = 'Expression of germline genes during development', 
        show_rownames = F, 
        breaks = breaks, 
        color = cols, 
        scale = 'none'
    )
```

This looks **MUCH** better now! It clearly appears that there are three major subsets of genes within the germline specific genes:  
- The genes almost exclusively expressed at the YA (yound adult) stage;  
- The genes expressed at the YA stage, with an expression already detected in L4 stage;  
- The genes expressed at the YA (yound adult) stage, which expression is maintained during the subsequent deveolpment of the embryo.  

I hope this short intro to Rmarkdown is enough to prove the importance of integrating it within everyone's R-based workflows!   

---

```{r echo = TRUE}
    # Additional functions
    sort.per.clusters
    clamp
    # Session info
    sessionInfo()
```