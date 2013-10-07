<?php include 'blocks/header.php'; ?>

<div id="home" class="custom">

	<section id="structure">
		<h2>About</h2>
		<h3>Object Oriented CSS</h3>
		<p>Object Oriented CSS, as the name suggests, is implementing the concepts of OOP in structuring and building CSS rules, which are easy to reuse, thereby reducing the loading time and increasing the performance of web pages incredibly! The key point here is, to identify, build and style modular reusable ‘objects’ in a page, and to reuse it in multiple instances by extending them with additional features wherever needed. Here an ‘object’ refers to the basic HTML markup and its CSS rules.</p>
		<p>This is neither a framework nor a technology, but an approach adopted in building the rules, so as to make the code more reusable, maintainable and scalable.</p>

		<h3>There are 2 main principles of OOCSS:</h3>
		<ol>
			<li><strong>Separation of structure from skin</strong><br />ie: 3 different buttons utilizing same strucutre, but have different widths/heights</li>
			<li><strong>Separation of containers and content</strong> <br />We're encouraged to give more forethought to what is common among different elements, then separate those common features into modules, or objects that can be reused anywhere. When we use OOCSS' class-based module building, we ensure that our styles are not dependent on any containing element.</li>
		</ol>

		<h3>Why should I code this way?</h3>
		<ul>
			<li>CSS is reusable</li>
			<li>Stylesheets become smaller</li>
			<li>Maintainable stylesheets (code is located in one block instead of many</li>
			<li>Easier to improve one block of code instead of many</li>
			<li>Easier to change parts of the site without breaking site</li>
			<li>Enables you to change your site consistently</li>
			<li>Faster website development</li>
		</ul>

		<h3>Dealing with smaller projects</h3>
		<p>It certainly may seem like overkill for smaller projects, but in terms of our company growth and direction we're heading. Utilizing OOCSS concepts even in smaller projects is a great start, especially the practice going forward to larger projects.</p>


		<h3>Guidelines for Implementation</h3>
		<ul>
			<li>Avoid descendent selectors (.sidebar h3)</li>
			<li>Avoid IDs in styling hooks</li>
			<li>Avoid attaching classes to elements in your stylesheets (div.header)</li>
			<li>Avoid using !important</li>
		</ul>

		<h3>External Resources</h3>
		<ul>
			<li><a href="https://github.com/stubbornella/oocss/wiki">https://github.com/stubbornella/oocss/wiki</a></li>
			<li><a href="http://www.vanseodesign.com/css/object-oriented-css/">http://www.vanseodesign.com/css/object-oriented-css</a></li>
		</ul>

		<h3>Object Oriented SASS</h3>
		<ul>
			<li><a href="https://portland2013.drupal.org/sites/default/files/slides/Sass_Silent_Classes_0.pdf">Utilizing %placeholder to extend your semantic CSS</a></li>
			<li><a href="https://coderwall.com/p/7p7w2a">When to use SASS mixins, extends, variables, & %placeholders</a></li>
			<li><a href="http://blog.adi.do/2012/09/object-oriented-media-queries-ooms-vs-media-oriented-objects-moo/">Object Oriented Media Queries</a></li>
			<li><a href="http://blog.teamtreehouse.com/extending-placeholder-selectors-with-sass">Extending Placeholder Selectors with SASS</a></li>
		</ul>
	</section>

	<section id="about">
		about
	</section>

</div>

<?php include 'blocks/footer.php'; ?>