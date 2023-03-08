<?php

nv_new_c (
	"c/go-home",
	function ( $VAR )
	{
		$VAR = array_merge( [
			"link" => "https://dev.iosi.global",
			"logo" => true,
			"heading" => "IOSI GLOBAL",
		], $VAR );

		$VAR["logo"] = $VAR["logo"] ? '<img src="https://iosi.global/wp-content/uploads/2021/07/logo-2022.svg" height="60" style="height:60px">' : "";

		return <<<HTML

		<div class="header header-nav">
			<a href="{$VAR["link"]}">
				<span style="transform: rotate(90deg);">▼</span>
				{$VAR["logo"]}
				<span class="" style="font-size: var(--font-hg);">{$VAR["heading"]}</span>
			</a>

			<!--div class="header-left cols-flex center">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
			</div>
			<div class="header-center cols-flex center">
				<h1>IOSI Products</h1>
			</div>
			<div class="header-right"></div-->
		</div>
		
		HTML;
	}
);

