<?php wp_head();

global $post;
$post_id = $post->ID;
$post_type_object = get_post_type_object($post->post_type);
$rest_base = $post_type_object->rest_base;
$url = get_permalink($post);
$slug = str_replace(home_url(), "", $url);

$params = [
    'secret' => get_field('nextwp_preview_secret', 'option'),
    'toolbar' => 'false',
    'rest_base' => $rest_base,
];

$isDraft = str_starts_with($slug, "/?");
if ($isDraft) {
    $params['id'] = $post_id;
} else {
    $params['uri'] = $slug;
}

$query = http_build_query($params);

?>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Preview</title>
    <style>
        iframe {
            position: fixed;
            top: 32px;
            left: 0;
            width: 100%;
            height: 100%;
        }
    </style>
</head>

<body>
    <?php $frontend_url = get_field('nextwp_frontend_url', 'option'); ?>
    <?php $frontend_url_trailing_slash = rtrim($frontend_url, '/') . '/'; ?>
    <?php $frontend_url_no_trailing_slash = rtrim($frontend_url, '/'); ?>

    <?php if ($frontend_url) : ?>
        <iframe id='preview' src="<?= $frontend_url_trailing_slash;
                                    ?>api/draft/preview?<?= $query; ?>" frameborder="0"></iframe>
    <?php endif; ?>
</body>

</html>
<?php wp_footer(); ?>