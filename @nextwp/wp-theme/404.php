<?php
// 404 page (not found)

get_header(); ?>
</header>

	<main class='page clearfix'>

		<div class="grid-edges">
			<section class="error-404 not-found">
				<header class="page__header">
					<h1 class="h1">Oops! That page can't be found.</h1>
				</header>

				<div class="page__content">
					<a href='<?php echo get_home_url(); ?>' class='button'>Try starting at the beginning again.</a>

				</div>
			</section>
		</div>

	</main>
<?php
get_footer();
