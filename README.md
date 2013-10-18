40D Semantic SASS 
=================

*Temporary Information (more to come)*

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
Before committing any changes, make sure you update the other syntax's source as well. This can be accomplished using `sass-convert`. Run the following commands while in the repository's root:

*SCSS -> SASS*

`sass-convert -R -T sass -F scss scss/ sass/`

*SASS -> SCSS*

`sass-convert -R -T scss -F sass sass/ scss/`
