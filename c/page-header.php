<?php
nv_new_c (
	"",
	function ( $VAR )
	{
		$VAR = array_merge( [
			"h1" => "",
			"h2" => "",
		], $VAR );

		

		return <<<HTML
		<header class="space-around-hg rows center">
			<h1>{$h1}</h1>
			<span>{$h2}</span>
		</header>
		HTML;
	}
);

