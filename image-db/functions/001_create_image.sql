DO
$block1$
BEGIN
	CREATE OR REPLACE FUNCTION create_image(p_image_url TEXT, p_image_id UUID)
	RETURNS UUID AS $$
	DECLARE
		new_image_id 				UUID;
	BEGIN
			INSERT INTO courseta_images.images (image_id, image_url)
			VALUES (p_image_id, p_image_url)
			RETURNING images.image_id INTO new_image_id;
			
			RETURN new_image_id;
	END;
	$$ LANGUAGE plpgsql;
END
$block1$ LANGUAGE PLPGSQL;
