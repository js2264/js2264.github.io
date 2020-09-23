---
title: How to build a website easily?
author: Jacques Serizay
date: 2018-10-12
lastmod: 2018-10-21
slug: setting-up-hugo-website
categories:
    - Hugo
    - R
    - markdown
tags:
    - Hugo
    - R
    - markdown
featured_image: "posts/HUGO.jpg"
header:
    caption: 'Hugo' 
    image: 'posts/HUGO.jpg' # relative to `static/img/` folder
    focal_point: '' # Options: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight
summary: "Here is how I set up a Hugo website in less than 15 minutes!"
draft: true 
---

One thing that nobody doesn't *really* need in academia is a nice, shiny personal website. Most people are content with their University website, which usually only has a single page to introduce the lab research, members, publications, etc. The only really *personal* page that most people will have is their directory page. Needless to say, being only able to see someone's (usually poor quality) photo and their email address is sometimes not enough, especially when you're on the hunt for jobs, or trying to know your collaborators a bit better, or have a peek at what your competitors are working on...  
</br>
Eventually, a personal website is your digital business card, your numeric fingerprint. And I believe it's worth spending a bit of time working out how to make a nice, easy-to-maintain website where you can regularly (or not!) write down about your thoughts, your life, your progresses, anything you'd want to share really. So I decided to explain how I built and maintain this website. In a nutshell, I rely on a combo of Atom + R + Hugo + Github to perform any task on my website. It is an easy, fast and very efficient workflow for anybody who can use a terminal.  
</br>
### Getting started with Hugo - Setting up a static website
Hugo is a framework to build static websites. *Static* websites, in opposition to *dynamic* websites, are constituted of immuable HTML files. You'll always see the same content when browsing a *static* website, until it is manually updated. No databases, no PHP, no CMS, just plain boring HTML files. And CSS. And JavaScript. Of course.  
</br>
But that's where Hugo comes into the game! Hugo facilitates all of the steps downstream of the writing. Once set up, you will not have to take care of maintaing all your website, Hugo does all the job. You're only left with the writing!  
</br>
But how does Hugo work, really? After setting up a new website, you'll have some config files, some Markdown templates, some custom CSS files if you want to, and more importantly (though you'll probably won't have to look into it!), all the layouts (a collection of 'partials' HTML files). So what Hugo does, when building a website, is translating your nicely written articles (in Markdown, because we love Markdown) into plain HTML articles, then stitching these HTML altogether with the needed bits (head, footer, etc.) to make a coherent whole.  
</br>
More importantly though, when building a page for new post, it will also updates all the pages that are impacted by this post. For instance, the Academic theme can feature the 'Recent' articles or publications of a website in the first landing page. The most recent articles are automatically taken to be displayed in this section. This is very handy, as it means you don't have to do all the work of manually modifying all the entries in all the different HTML files. Over are the old days of chasing all your dead links!  
</br>
### Building the workflow from scratch
T.B.C.   
</br>
### A little bit a customization can't hurt!
T.B.C.   
</br>
### Streamlining the update process
T.B.C.   
