#!/usr/bin/env sh

: ${1?Need a value}

function checkcommit() {
    if [ -z "$1" ]; then
        echo "ERROR: Please provide a commit description. Aborting."
        exit 1
    fi
}
function usage() {
    echo "\nThis script is a wrapper to build .Rmd posts, add them to a website generated with Hugo and upload the whole site (in ./public/) on Github."
    echo ""
    echo "USAGE:\tbin/build.website.sh -m|-commit 'commit blurb'"
    echo ""
}

## Read arguments
POSITIONAL=()
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -m|--commit)
            COMMIT=''
            COMMIT="$2"
            checkcommit ${COMMIT}
            shift # past argument
            shift # past value
            ;;
        -h | --help)
            usage
            exit
            ;;
        *)
            echo "ERROR: unknown parameter \"$key\""
            usage
            exit 1
            ;;
    esac
done
set -- "${POSITIONAL[@]}" # restore positional parameters

# Echo commit
echo "$0 -m ${COMMIT}"

# Build website
R -e "Sys.setenv(RSTUDIO_PANDOC='/Applications/RStudio.app/Contents/MacOS/pandoc'); blogdown::build_site()"

# Sync Github repo of public/ (the static website)
cd public/
git add .
git commit -m ${COMMIT}
git push
cd ..

# Sync Github repo of the Hugo content (this root)
echo "public/" > .gitignore
git add .
git commit -m ${COMMIT}
git push