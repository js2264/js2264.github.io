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

# Sync Github
cd public/
#git init
#echo "node_modules/" > .gitignore
git add .
git commit -m ${COMMIT}
#git remote add origin https://github.com/js2264/js2264.github.io.git
git push
cd ..
