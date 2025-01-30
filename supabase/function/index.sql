BEGIN
  DECLARE
    USER_SETTING_ID UUID := gen_random_uuid();
    POST_ID_1 UUID := gen_random_uuid();
    POST_ID_2 UUID := gen_random_uuid();
    POST_ID_3 UUID := gen_random_uuid();
    POST_ID_4 UUID := gen_random_uuid();
    TAG_ID_1 UUID := gen_random_uuid();
    TAG_ID_2 UUID := gen_random_uuid();
  BEGIN
    -- Insert/Update public.users
    INSERT INTO public.users (id, user_code, name, bio, last_logined_at, created_at, updated_at)
    VALUES (NEW.id, NEW.raw_user_meta_data ->> 'name', NEW.raw_user_meta_data ->> 'name', '', NULL, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
      user_code = EXCLUDED.user_code,
      name = EXCLUDED.name,
      updated_at = NOW();

    -- Insert into public.user_settings
    INSERT INTO public.user_settings (id, user_id, notification_enabled, notification_time, created_at, updated_at)
    VALUES (USER_SETTING_ID, NEW.id, TRUE, '22:00', NOW(), NOW());

    -- Insert into public.posts
    INSERT INTO public.posts (id, content, encrypt_content, user_id, visibility, created_at, updated_at, date, score)
    VALUES 
      (POST_ID_1, '', '\xc30d040703029ec1bd1abcd7ae0a7dd28a011f3b7d72ae62ed74a806f8f1156c332a13daaf52ed842096aaf5b2e0f94db85a3e9c6b0a6962f1e9a5294c12d8d76549a275729abf506341d5ee8ec96fcc6c7a5268b0b631f41fb1e340f8fc037962b5c8a5d4979debddf6e7bd50a99c445fcfad2356087cf2adef190d376fe32458bbb3a07d5e9b7b9100d2c814bd2b7f70ef48800b52b730239d3e', NEW.id, 'public', NOW(), NOW(), CURRENT_DATE, 0.3), 
      (POST_ID_2, '', '\xc30d04070302c1b01a956905ecb864d2c05d01a269b089b224fb3a6f7351a92f2103b86ebb17f896e683d8d337c4aac0d78dbca853fa39ba3ae5acd6f4a0d8c3c486616943e6c0dff614b36100cd9545b514d8864314f25ba014b50234424a38bc09ce8ca90bf36b68a30056c543263fcb707e3d32288c9d8b34483fae02315a96985656643ca0e47f5bb148976f3e522284c60be4ecb8cf12890953c6df56135e03e81e7b5ecf9c4352fc86a481800e9e59bf3d090272f224cee8af80db971a570a09e85ad5f8f2afd518ccaa34ed36f294b30c4e93e3b47cadd28736d941e0046e89f2f0d596ed42859f3953979a6bb83fd7ce03c71bfcc513e3d4444698b6cb2e21fe6c282208962080640e0339bace61e941c0b02cd671749ffa401aa5d41ee48c190417c366c7c2ff62e7af17', NEW.id, 'public', NOW(), NOW(), CURRENT_DATE, -0.4), 
      (POST_ID_3, '', '\xc30d04070302a6cbc40781fb3d7164d28c01511252aeaf3b33686c4fe9412a601296eaec45d14f7cf59fbd078b69a12aa099ea969117d2ba5daecb4d674a3c0031419629d92c9cee19d29dba60f2df067f82fd7e6acd8a2903f419c758a9b4e5cb625874869d76eb3fa8fbae5d8dedfa1dd64cb6e936003a615a51855a9f3719bffc7fe9533c21e717e24aa85ef23b8fdda845af051d786dfc43b00a6b', NEW.id, 'public', NOW(), NOW(), CURRENT_DATE, 0.5), 
      (POST_ID_4, '', '\xc30d040703025255378cb0ee2b1778d2c027010425898d0d7689d1fdb311c190ef82089eca11d11003d1095f6397a55d64c2d87bdd12c812076fd0a0715d5c93b8326b85406f3ff3526f47fc13849ebefc84ff890a179e013355149eaec2cca9557a31bfbac5808c2d2777aa6a8807478d6588f648e1b446baa97aebfab9ba564b838248c0e818e9752034c4385d0f03850fc54fc16503e2b67a1d23dc2c5deed3993ef00b943a0a7ed2bcddd137a3cec6618c564c7c639f8698b2565f7c5c6ef826bc6e234cd5cfb39f76474eff49cf31c36bcc731b83fc49468aece1f10938fe99354a2aed24d166096d4d843003a4c8cb6cd1d89447c9ba', NEW.id, 'public', NOW(), NOW(), CURRENT_DATE, -0.2);

    -- Insert into public.tags
    INSERT INTO public.tags (id, name, user_id, created_at, updated_at)
    VALUES 
      (TAG_ID_1, 'チュートリアル', NEW.id, NOW(), NOW()),
      (TAG_ID_2, 'サンプル', NEW.id, NOW(), NOW());

    -- Insert into public.post_tags
    INSERT INTO public.post_tags (post_id, tag_id, created_at, updated_at)
    VALUES
      (POST_ID_1, TAG_ID_1, NOW(), NOW()),
      (POST_ID_2, TAG_ID_1, NOW(), NOW()),
      (POST_ID_3, TAG_ID_2, NOW(), NOW()),
      (POST_ID_4, TAG_ID_2, NOW(), NOW());

    RAISE WARNING '完了したよ！';
    RETURN NEW;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Transaction failed for user_id: %, Error: %', NEW.id, SQLERRM;
    RETURN NULL;
  END;
END;
