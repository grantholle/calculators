<?php include 'blocks/header.php'; ?>

<div id="home" class="custom">

	<section id="about">
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

	<section id="documentation">
		<h2>Structure</h2>
		<p>As our projects get larger in size, we need to look at scalability, flexibility, and usability. Our structure is made up from 5 separate componentes: mixins, modules, partials, vendor, and app.</p>

		<ul class="file-structure">
			<li class="icon-folder">
				<span>mixins</span>
				<ul>
					<li class="icon-file">mix-fonts.scss</li>
					<li class="icon-file">mix-general.scss</li>
					<li class="icon-file">mix-media-queries.scss</li>
				</ul>
			</li>
			<li class="icon-folder">
				<span>modules</span>
				<ul>
					<li class="icon-file">default.scss</li>
					<li class="icon-file">fonts.scss</li>
					<li class="icon-file">responsive-grid.scss</li>
					<li class="icon-file">variables.scss</li>
					<li class="icon-file">wordpress-default.scss</li>
				</ul>
			</li>
			<li class="icon-folder">
				<span>partials</span>
				<ul>
					<li class="icon-file">footer.scss</li>
					<li class="icon-file">header.scss</li>
					<li class="icon-file">nav.scss</li>
					<li class="icon-file">sidebar.scss</li>
					<li class="icon-file">wysiwyg.scss</li>
				</ul>
			</li>
			<li class="icon-folder">vendor</li>
			<li class="icon-folder">app</li>
			<li class="icon-file">style.scss</li>
			<li class="icon-file">ie.scss</li>
		</ul>
	</section>

	<section id="mixins">
		<h3>Mixins</h3>
		<p>In its simplest form, mixins allow for efficient and clean code repetitions, as well as an easy way to adjust your code with ease.</p>
		<p>That's what we've known, however there are also functions, placeholders, and extends which are lesser known features of sass. You're correct to assume that most of our @mixins will come from Compass. However, in order to get the most out of sass, we're going to be utilizing functions and  %placeholders.</p>
		<p>For a detailed informative guide on the <a href="http://miguelcamba.com/blog/2013/07/11/sass-placeholders-versus-mixins-and-extends/">differences between @mixins, @extends, and %placeholders</a>, please take some time review and familiarize yourself with the different extend options.</p>

		<h5>Some quick rules to follow:</h5>
		<ul>
			<li>Comment and explain all mixins, placeholders, and functions where possible.</li>
			<li>If creating a new mixin sass file, include <span class="highlight">_mix-</span> infront of the filename.</li>
			<li>Never declare mixins that don't accept parameters. While a rule of thumb, it won't always be possible.</li>
			<li>Try not to extend on normal selectors.</li>
			<li>Build reusable styles.</li>
		</ul>

		<h5>Included Mixins</h5>
		<ul>
			<li>
				<strong>mix-fonts.scss</strong> - Font mixin for managing external fonts either from a third party or via @font-face. To add a new font-family, simply copy @if statement and assign your own family names and values you want to pass along when pulling font.
<pre class="line-numbers language-scss"><code>@mixin font($family: sans-serif, $weight: normal) {
	// FF Tisa Web Pro
	@if $family == "font-tisa" {
		font-family: "ff-tisa-web-pro", serif;
		font-style: normal;
	}
	// Brandon Grotesque
	@if $family == "font-brandon" {
		font-family: "Brandon-Grotesque", sans-serif;
	}
	// Generic Font Stack
	@if $family == "font-generic" {
		font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
	}
	font-weight: $weight;
}</code></pre>

Example: To assign font to a selector (the first input is the font-family name you've assigned in your mixin, the second is the font-weight if there's one)
<pre class="line-numbers language-scss">
<code>.selector-example-one {
	@include font('font-brandon, 800');
}
.selector-example-two {
	@include font('font-tisa');
}</code>
</pre>

Outcome:
<pre class="line-numbers language-css">
<code>.selector-example-one {
	font-family: "Brandon-Grotesque", sans-serif;
	font-weight: 800;
}
.selector-example-two {
	font-family: "ff-tisa-web-pro", serif;
	font-style: normal;
}</code>
</pre>
			</li>
			<li>
				<strong>mix-utility.scss</strong> - Basic utlity mixins that should get you started with most new projects.
<pre class="line-numbers language-scss">
<code>// Clear Function
%cf {
	zoom: 1;
	&:before,
	&:after {content: ""; display: table;} 
	&:after {clear: both;}	
}

// Font Smoothing
%font-smoothing {
	-webkit-font-smoothing: antialiased;
	text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.004);
}

// Alpha Transparency
@mixin rgba($color, $alpha) {
    $rgba: rgba($color, $alpha);
    $ie-hex-str: ie-hex-str($rgba);
    background-color: transparent;
    background-color: $rgba;
    filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#{$ie-hex-str},endColorstr=#{$ie-hex-str});
    zoom: 1;
}

// max-width
%row {
	max-width: $max-width;
	width: 100%;
	margin: 0 auto;
	@extend %horizontal-padding;
	@extend %vertical-padding;
}

// Horizontal Site Padding
%horizontal-padding {
	padding-left: $gutter-small-horizontal;
    padding-right: $gutter-small-horizontal;

    @include mq-min-medium {
        padding-left: $gutter-medium-horizontal;
        padding-right: $gutter-medium-horizontal;
    }

    @include mq-min-xlarge {
        padding-left: $gutter-large-horizontal;
        padding-right: $gutter-large-horizontal;
    }
}

// Vertical Site Padding
%vertical-padding {
	padding-top: $gutter-small-vertical;
    padding-bottom: $gutter-small-vertical;

    @include mq-min-medium {
        padding-top: $gutter-medium-vertical;
        padding-bottom: $gutter-medium-vertical;
    }

    @include mq-min-xlarge {
        padding-top: $gutter-large-vertical;
        padding-bottom: $gutter-large-vertical;
    }
}</code>
</pre>
				All of the mixins will be dependant on project. 
				<ul>
					<li><strong>%cf</strong> - Instead of manually including a clear function to your code through a class (which you still have an option), we can also <code>@extend %cf</code> on any selector.</li>
					<li><strong>@mixing rgba()</strong> - Compass doesn't support RGBA for older browsers, this handy mixin will give you alpha transparency on all backgrounds as far back as IE7. To use, simply add to your selector and adjust accordingly: <code>@include rgba(#000, .7);</code></li>
					<li><strong>%row</strong> - Use if you are looking at extending at centering an element and scale to max-width of the site. Handy for resonsive sites. You can also add a class through <code>.row</code> to the element.</li>
					<li><strong>%horizontal-padding & %vertical-padding</strong> - Both are geared for responsive sites where the padding around content adjusts accordingly depending on view.</li>
				</ul>
			</li>
			<li>
				<strong>mix-media-queries.scss</strong> - Mixins for managing media queries on responsive sites.
<pre class="line-numbers language-scss"><code>//----------------------------------*\
// MIN-WIDTH
//----------------------------------*/

// Phone Landscape Up
@include mq-min-small {
	@content;
}

// Tablet Up
@include mq-min-medium {
	@content;
}

// Desktop Up
@include mq-min-large {
	@content;
}

// Large Screens Up 
@include mq-min-xlarge {
	@content;
}

//----------------------------------*\
// MAX-WIDTH
//----------------------------------*/

// Desktop Down
@include mq-max-large {
	@content;
}

// Tablet Portrait Down
@include mq-max-medium {
	@content;
}

// Phone Landscape Down
@include mq-max-small {
	@content;
}

// Phone Portrait Down
@include mq-max-mini {
	@content;
}</code></pre>

<p>Example usage of min-width (mobile-first). In the example, the font will get larger as the device gets larger. Please note that with mobile-first you will have to go small -> xlarge in the order the media-queries are added for them to work. </p>
<p>When designing your components for mobile first, they are designed phone up. All your styles are made for smaller devices and scaled up or changed where necessary.</p>
<pre class="line-numbers language-scss"><code>.selector {
	font-size: 14px;
	@include mq-min-medium {
		font-size: 16px;
	}
	@include mq-min-large {
		font-size: 18px;
	}
	@include mq-min-xlarge {
		font-size: 20px;
	}
}</code></pre>

<p>Example usage of max-width (desktop-first). In the example, the font will get smaller as the device gets smaller. Please note that with desktop-first you will have to go large -> small in the order the media-queries are added for them to work. </p>
<pre class="line-numbers language-scss"><code>.selector {
	font-size: 20px;
	@include mq-max-medium {
		font-size: 20px;
	}
	@include mq-max-small {
		font-size: 16px;
	}
	@include mq-max-mini {
		font-size: 12px;
	}
}</code></pre>

<div class="highlight">
Please note that we're using mobile-first for all of our projects. There will be instances where we'll have to use max-width (desktop-first) in rare cases, more specifically for navigations. 
</div>
			</li>
		</ul>
	</section>

</div>

<?php include 'blocks/footer.php'; ?>