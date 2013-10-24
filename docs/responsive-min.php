<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1" />
	<title>Mobile First</title>
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

<section class="example-wrap">
	<article>
		<h3>Mobile First Responsive / Progressive Enhancement</h3>
		<p>Lorizzle tellivizzle uhuh ... yih! sizzle amizzle, its fo rizzle adipiscing elizzle. Nullam sapien velizzle, pimpin' volutpizzle, suscipizzle cool, boofron vizzle, sheezy. Pellentesque gangsta tortizzle Sizzle. Bizzle gangsta izzle dapibizzle yo mamma tempizzle tempizzle. Izzle ghetto nibh izzle i saw beyonces tizzles and my pizzle went crizzle. Shiznit izzle dang. Cool eleifend rhoncizzle nisi.</p>
		<p>In hac habitasse shit dictumst. Get down get down dapibizzle. Da bomb tellizzle urna, pretizzle ghetto, mattizzle ac, eleifend vitae, nunc. Fo shizzle rizzle. Integer semper velit sizzle purus.</p>
		<h4>Max-Width Mixins</h4>
		<pre class="line-numbers language-scss"><code>@include mq-min-small {} 			/* phone landscale up */
@include mq-min-medium {} 			/* tablet portrait up */
@include mq-min-large {} 			/* desktops and tablets landscape up */
@include mq-min-xlarge {} 			/* xlarge screens up */</code></pre>
		<h4>CSS Code</h4>
		<pre class="line-numbers language-scss"><code>.example-wrap {
	margin: 0 auto;
	padding: 10px;
	width: 280px;
	margin-top: 100px;
	background: #FFF;

	@include mq-min-small {
		width: 480px;
	}
	@include mq-min-medium {
		width: 100%;
		padding: 0 10%;
		box-shadow: 20px 20px 0px 0px $color-eggshell-dark;
	}
	@include mq-min-large {
		max-width: 1300px;
	}
	@include mq-min-xlarge {
		padding: 0 20px;
	}

	// Article Styling
	article {
		padding: 40px;
	}

	// Font Sizes
	p {
		font-size: 13px;
		@include mq-min-medium {
			font-size: 1em;
		}
		@include mq-min-large {
			font-size: 20px;
			color: $color-blue;
		}
	}
}
			</code></pre>

			<h4>IE Stylesheet Output</h4>
			<pre class="line-numbers language-scss"><code>.example-wrap {
  margin: 0 auto;
  padding: 10px;
  width: 280px;
  margin-top: 100px;
  background: #FFF;
  width: 100%;
  padding: 0 10%;
  box-shadow: 20px 20px 0px 0px #dbdbd9;
  max-width: 1300px;
  padding: 0 20px;
}

.example-wrap article {
  padding: 40px;
}

.example-wrap p {
  font-size: 13px;
  font-size: 1em;
  font-size: 20px;
  color: #1e85d4;
}</code></pre>
	</article>
</section>


</div>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script type="text/javascript" src="./js/vendor/prism.min.js" data-default-language="markup"></script>
<script type="text/javascript" src="./js/application.js"></script>
</body>
</html>