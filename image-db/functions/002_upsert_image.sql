DO
$block1$
BEGIN
	CREATE OR REPLACE FUNCTION upsert_image(p_image_id UUID, p_image_url TEXT)
	RETURNS BOOLEAN AS $$
	DECLARE
		updated_rows INT;
		result_id   UUID;
	BEGIN

    INSERT INTO courseta_image.images (image_id, image_url)
    VALUES (p_image_id, decode(p_image_url, 'base64'))
    ON CONFLICT (image_id) DO UPDATE SET
    image_url = decode(p_image_url, 'base64');

		GET DIAGNOSTICS updated_rows = ROW_COUNT;
		RETURN updated_rows > 0;
	END;
	$$ LANGUAGE plpgsql;
END
$block1$ LANGUAGE PLPGSQL;
