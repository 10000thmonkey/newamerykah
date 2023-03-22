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
				<span>▼</span>
				{$VAR["logo"]}
				<div>{$VAR["heading"]}</div>
			</a>
		</div>
		
		HTML;
	}
);

