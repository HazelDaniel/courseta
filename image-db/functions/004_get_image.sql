DO
$block1$
BEGIN
	CREATE OR REPLACE FUNCTION get_image(p_image_id UUID)
	RETURNS TEXT AS $$
	DECLARE
			v_image_url TEXT;
	BEGIN
			SELECT translate(encode(images.image_url, 'base64'), E' \t\n\r', '')::TEXT INTO v_image_url
			FROM courseta_image.images
			WHERE images.image_id = p_image_id;

			RETURN v_image_url;
	END;
	$$ LANGUAGE plpgsql;
END
$block1$ LANGUAGE PLPGSQL;
