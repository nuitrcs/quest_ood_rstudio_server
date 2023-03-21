# Rstudio Server for Deployment on Northwestern High-Performance Computing cluster Quest

This app was derived from from [fas-ondemand-rstudio](https://github.com/ondemand/fas-ondemand-rstudio.git) which itself was derived from[bc_osc_rstudio_server](https://github.com/OSC/bc_osc_rstudio_server), a template kindly provided by the [OSC OpenOnDemand](https://github.com/OSC/ondemand)
Team. 

It launches a Rstudio server within a batch job.

## Prerequisites

[Singularity](http://singularity.lbl.gov/) is required as the software will be run as a singularity container.

## Install

The main branch of this repo is automatically deployed by **puppet** to /var/www/ood/apps/sys/ on the ondemand nodes.

## Development

To make changes in a development environment, login to OnDemand and start a shell session and then follow these instructions:

```sh
# create the development folder if you still not have one
mkdir -pv $HOME/ondemand/dev/
cd $HOME/ondemand/dev/

# clone the repository in a subfolder for your version of the app
git clone https://github.com/nuitrcs/quest_ood_rstudio_server

# Change the working directory to this new directory
cd quest_ood_rstudio_server
```

Once that's done, you can run your version of the app from the sandbox control panel under the *dev* menu on the ondemand dashboard.

See also:
- https://osc.github.io/ood-documentation/latest/app-development.html 
