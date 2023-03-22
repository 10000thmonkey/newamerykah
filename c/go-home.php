<?php

nv_new_c (
	"c/go-home",
	function ( $VAR )
	{
		$VAR = array_merge( [
			"link" => "https://dev.iosi.global",
			"logo" => true,
			"heading" => "Home",
		], $VAR );

		$VAR["logo"] = $VAR["logo"] ? '<img src="https://iosi.global/wp-content/uploads/2021/07/logo-2022.svg">' : "";

		return <<<HTML

		<div class="header header-nav">
			<a href="{$VAR["link"]}">
				<span style="transform: rotate(90deg);">▼</span>
				{$VAR["logo"]}
				<span class="" style="font-size: var(--font-md);">{$VAR["heading"]}</span>
			</a>
		</div>
		
		HTML;
	}
);

