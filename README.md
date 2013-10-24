40D Semantic SASS 
=================

Installation
------------
1. You'll need to generate the configuration using your GUI tool or the command line: `compass config [path/to/config_file.rb]`
2. You can then go in and set your directories and whatnot.

Problem
-------
As we continue to grow as a company both clientele and development wise, we've shifted from having one person working on a project, up to 2-3 at times depending on the complexity. As developers, we have our own way of doing the site framework. Maybe there's a way we've always known to do things, or we've picked up a framework to use instead.

Solution
--------
As we move forward with new and exciting projects, we need to look at utilizing CSS/SASS that is both semantic and modular in its basic form. As developers we owe it to ourselves, but also our fellow team members to write CSS that can easily be picked up both now and for when we re-visit projects.

At its basic form, the structure will be split up into several blocks that can be pulled and utilized in our projects. 

* Typography
* Grid Structure
* Media Queries


SASS/SCSS Conversion
--------------------
Please keep this repository in SCSS format before all commits. If you prefer SASS, you can convert using the following command:

*SCSS -> SASS*

`sass-convert -R --from scss --to sass scss sass && rm -rf scss`

...and then **back to SCSS before you commit:**

*SASS -> SCSS*

`sass-convert -R --from sass --to scss sass scss && rm -rf sass`
