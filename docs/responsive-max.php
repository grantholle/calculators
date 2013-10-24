<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1" />
	<title>Desktop Responsive / Graceful Degradation</title>
	<!--[if lte IE 8]>
    	<link rel="stylesheet" href="ie.css">
	<![endif]-->
	<!--[if gt IE 8]><!-->
	    <link rel="stylesheet" href="style.css">
	<!--<![endif]-->
	<!--[if lt IE 9]>
	<script src="/js/vendor/html5shiv.js"></script>
	<![endif]-->
	<script type="text/javascript" src="//use.typekit.net/tuw1waz.js"></script>
	<script type="text/javascript">try{Typekit.load();}catch(e){}</script>
</head>
<body>

<section class="example-wrap-max">
	<article>
		<h3>Desktop Responsive / Graceful Degradation</h3>
		<p>Lorizzle tellivizzle uhuh ... yih! sizzle amizzle, its fo rizzle adipiscing elizzle. Nullam sapien velizzle, pimpin' volutpizzle, suscipizzle cool, boofron vizzle, sheezy. Pellentesque gangsta tortizzle Sizzle. Bizzle gangsta izzle dapibizzle yo mamma tempizzle tempizzle. Izzle ghetto nibh izzle i saw beyonces tizzles and my pizzle went crizzle. Shiznit izzle dang. Cool eleifend rhoncizzle nisi.</p>
		<p>In hac habitasse shit dictumst. Get down get down dapibizzle. Da bomb tellizzle urna, pretizzle ghetto, mattizzle ac, eleifend vitae, nunc. Fo shizzle rizzle. Integer semper velit sizzle purus.</p>

		<h4>Max-Width Mixins</h4>
		<pre class="line-numbers language-scss"><code>@include mq-max-large {} 			/* desktops down */
@include mq-max-medium {} 			/* tablet portrait down */
@include mq-max-small {} 			/* phones landscape down */
@include mq-max-mini {} 			/* phone portrait down */</code></pre>
		<h4>CSS Code</h4>
		<pre class="line-numbers language-scss"><code>.example-wrap-max {
	width: 100%;
	background: #FFF;
	margin: 0 auto;
	margin-top: 100px;
	max-width: 1200px;

	@include mq-max-medium {
		max-width: auto;
		width: 700px;
		padding: 0 5%;
	}

	@include mq-max-small {
		width: 100%;
	}

	// article styling
	article {
		padding: 40px;
		@include mq-max-small {
			padding: 30px 15px;
		}
	}

	// headlines
	h3 {
		@include mq-max-medium {
			color: $color-blue;
		}
	}
	h4 {
		@include mq-max-mini {
			text-decoration: underline;
			text-transform: none;
		}
	}

	// paragraphs
	p {
		font-size: 20px;

		@include mq-max-medium {
			font-size: 16px;
		}
		@include mq-max-small {
			font-size: 14px;
		}

		@include mq-max-mini {
			font-size: 12px;
		}
	}
}
			</code></pre>
	</article>
</section>


</div>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script type="text/javascript" src="./js/vendor/prism.min.js" data-default-language="markup"></script>
<script type="text/javascript" src="./js/application.js"></script>
</body>
</html>