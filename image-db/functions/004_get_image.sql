DO
$block1$
BEGIN
	CREATE OR REPLACE FUNCTION get_image(p_image_id UUID)
	RETURNS TEXT AS $$
	DECLARE
			v_image_url TEXT;
	BEGIN
			SELECT image_url INTO v_image_url
			FROM courseta.images
			WHERE images.image_id = p_image_id;
			
			RETURN v_image_url;
	END;
	$$ LANGUAGE plpgsql;
END
$block1$ LANGUAGE PLPGSQL;
