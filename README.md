# Ragù

Check the [website](https://raguproject.github.io/) of the project.

[![DOI](https://zenodo.org/badge/609063438.svg)](https://zenodo.org/badge/latestdoi/609063438)


## Abstract

Ragu is a project that aims to collect, catalog and make available to everyone a precious but little-explored heritage of the Italian culinary tradition: **family cookbooks**. These texts, written and handed down basically by women, risk being forgotten and remain in the shadows, due to their **semi-cultured nature**. To date, many recipe books have already been collected, they come from varied geographical areas and date back to different eras. This precious knowledge has flowed into a **digital archive** that aspires to preserve it and facilitate its dissemination.

## Goals

Handwritten domestic cookbooks are precious documents, capable of illustrating cultures, relationships and traditions. The digital archive of culinary knowledge is the place where decades of Italian tradition, made up of recipes and anecdotes from the past come together. The objectives that the digital archive has set itself are therefore to collect, preserve and make easily consultable the Italian cookbooks that are gathered in the context of the Ragù project. The archive promotes dynamic consultation, i.e. with a high level of user interaction, so as to stimulate ever wider and more active dissemination. 

## Website

The digital archive is made up of three macro-sections, each of which has its own specificities.

### Homepage - storytelling and data visualization

The homepage of the site takes advantage of **digital storytelling**, a technique that is particularly suited to the themes of the project.
The contents are therefore organized within a structure that exploits a **narrative element**, specifically the red thread of history and tradition.
Another fundamental component that fits into the narrative is that of **data visualization**. The story, the project, are therefore also told through the data collected in the context of the project. Significant relationships and patterns were explored and then placed in the context of the storytelling.

### Explore the recipes - Filter and browse

The core section of the site is the exploratory section. The user has the possibility to explore the recipes collected and cataloged in the context of the project. The recipes can be filtered through categories (type of meal, ingredients, city of origin). Each recipe, if clicked, allows access to the relative digitized photo and metadata.

### Browse the cookbooks [coming soon]

In this section it is possible to access the digitized cookbooks and browse them in their entirety. This section is currently under construction.

## Methodology

From a methodological point of view, it should first of all be noted that in principle it was chosen to use Github for the realization of the website. Github is a service that allows you to keep your files online for free and publish them through their Github Pages service as a static website.

This choice was made because Github is a very used and extremely intuitive platform, very popular because it allows a dynamic and effective collaboration between people working on a same project. The choice to use Github will in fact allow the collaborators of the Ragu Project to update the files related to cookbooks and consequently the website very easily.

Having said this, the data we have at our disposal and that have been provided to us are in tabular format. This data contains all the information related to the notebooks that have been until now found, scanned and analyzed.

This is a "work in progress", that is, since the recipe books are delivered gradually and continue to be found and because the data are many, from a methodological point of view we decided to build a site with the information we have at the moment, but with the possibility of enriching it dynamically and in a simple way with new information, cookbooks, recipes. No technical knowledge is needed to upload new files to Github and to have the website updated automatically.

A Github built-in technology was used, called Github Action. An "action" was therefore written in which it was stated that whenever a particular file type is updated, the configuration files that are used to display information on the site must regenerate and feed the new updated information. 

The Google Sheet that has been made available to us, compiled by Roberta Balduzzi, has been studied to understand the most effective way to relate to data. The most important information to show and how to organise it was decided. The data has been therefore divided into separate configuration files and JSON extensions that are automatically created thanks to a python script that is activated by a Github Action. 

Each recipe has its own JSON file and then additional JSON files have been created that contain summary information about recipes (e.g. origin of each recipe, ingredients contained in every recipe, information for the development of the charts...). These JSON files containing the summary information allow the site to be more streamlined and faster in use.

The website is built using JavaScript, a programming language for developing dynamic websites, and jquery, a fast, small, and feature-rich JavaScript library. The JSON files are therefore "transformed" in Javascript objects in order to be easily manipulated and inserted dynamically within the website. 

The fundamental element from a methodological point of view is therefore that of dynamism. By simply updating the files contained in the repository of the Ragu project, the site is able to update itself in a dynamic and effective way.


____________________________________________

## How to update the website contents:

**METADATA & VOCABULARIES (SPREADSHEET)**

1. Access the project **spreadsheet**;

2. Download in **.tsv** format both *metadata* and *vocabulary*, so that you have two files: "**ragu_disci - metadati.tsv**" and "**ragu_disci - vocabolari.tsv**";

3. On github, access the [repository](https://github.com/raguproject/raguproject.github.io) of the Ragù project and click on **add file > upload files**;

<img width="922" alt="Schermata 2023-05-16 alle 15 26 21" src="https://github.com/raguproject/raguproject.github.io/assets/133123523/40e6e7fe-f4e8-4d12-bc5c-c7814a171909">

4. Drag or add the two new files without changing the name of any file;

<img width="525" alt="Schermata 2023-05-16 alle 15 28 53" src="https://github.com/raguproject/raguproject.github.io/assets/133123523/2b33777f-d611-46c5-8c09-0924ec74e09d">

5. Commit changes, if you want by entering *data update* as commit description.

<img width="784" alt="Schermata 2023-05-16 alle 15 54 54" src="https://github.com/raguproject/raguproject.github.io/assets/133123523/e500f3f3-7b60-4c83-a93b-7b073fa2496f">


**THE PHOTOS**

To add new photos, simply access the [recipe_photos](https://github.com/raguproject/raguproject.github.io/tree/main/recipe_photos) folder in the repository and then repeat the above steps **3, 4 and 5**.
