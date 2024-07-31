DO
$block1$
BEGIN
	CREATE OR REPLACE FUNCTION update_image(p_image_id UUID, p_image_url BYTEA)
	RETURNS BOOLEAN AS $$
	DECLARE
			updated_rows INT;
	BEGIN
			UPDATE courseta_images.images
			SET image_url = p_image_url
			WHERE images.image_id = p_image_id;
			
			GET DIAGNOSTICS updated_rows = ROW_COUNT;
			RETURN updated_rows > 0;
	END;
	$$ LANGUAGE plpgsql;
END
$block1$ LANGUAGE PLPGSQL;
