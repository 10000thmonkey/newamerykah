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
			$VAR["logo"] = "<img src='/wp-content/plugins/newamerykah/a/iosi-global-logo.svg'>";

		return <<<HTML
		<header class="site-header-iosi space-around-hg rows gap-hg center textwrap">
			{$VAR["logo"]}
			<h1>{$VAR["h1"]}</h1>
			<span style="font-size: var(--font-md)">{$VAR["h2"]}</span>
		</header>
		HTML;
	}
);

