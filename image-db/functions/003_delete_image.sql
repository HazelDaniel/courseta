DO
$block1$
BEGIN
	CREATE OR REPLACE FUNCTION delete_image(p_image_id UUID)
	RETURNS BOOLEAN AS $$
	DECLARE
			deleted_rows INT;
	BEGIN
			DELETE FROM courseta.images
			WHERE images.image_id = p_image_id;
			
			GET DIAGNOSTICS deleted_rows = ROW_COUNT;
			RETURN deleted_rows > 0;
	END;
	$$ LANGUAGE plpgsql;
END
$block1$ LANGUAGE PLPGSQL;
