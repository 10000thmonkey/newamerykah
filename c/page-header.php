<?php
nv_new_c (
	"c/page-header",
	function ( $VAR )
	{
		$VAR = array_merge( [
			"logo" => false,
			"h1" => "",
			"h2" => "",
		], $VAR );

		if ($VAR["logo"])
			$VAR["logo"] = "<img src='/wp-content/plugins/a/iosi-global-logo.svg'>";

		return <<<HTML
		<header class="site-header-iosi space-around-hg rows center">
			{$VAR["logo"]}
			<h1>{$VAR["h1"]}</h1>
			<span>{$VAR["h2"]}</span>
		</header>
		HTML;
	}
);

