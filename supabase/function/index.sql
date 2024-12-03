BEGIN
  DECLARE
    POST_ID_1 UUID := gen_random_uuid();
    POST_ID_2 UUID := gen_random_uuid();
    POST_ID_3 UUID := gen_random_uuid();
    POST_ID_4 UUID := gen_random_uuid();
    TAG_ID_1 UUID := gen_random_uuid();
    TAG_ID_2 UUID := gen_random_uuid();
  BEGIN
    RAISE NOTICE 'Inserting/Updating with id: %, name: %', 
      NEW.id, NEW.raw_user_meta_data ->> 'name';

    -- Insert/Update public.users
    BEGIN
      INSERT INTO public.users (id, user_code, name, bio, last_logined_at, created_at, updated_at)
      VALUES (NEW.id, NEW.raw_user_meta_data ->> 'name', NEW.raw_user_meta_data ->> 'name', '', NULL, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET
        user_code = EXCLUDED.user_code,
        name = EXCLUDED.name,
        updated_at = NOW();
      EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Failed to insert/update public.users for id: %, Error: %', NEW.id, SQLERRM;
      RETURN NULL; 
    END;

    -- Insert public.posts
    BEGIN
      INSERT INTO public.posts (id, content, user_id, visibility, created_at, updated_at, date, score)
      VALUES 
        (POST_ID_1, E'reneへようこそ！\n右下のボタンから今のきもちを保存してみよう！', NEW.id, 'public', NOW(),NOW(), CURRENT_DATE, 0.3), 
        (POST_ID_2, E'画像や場所、作品と紐付けて後から思い出しやすくするのもおすすめ！\nでも場所や作品と紐付けると他の人も見れる場合があるから公開範囲の設定には気をつけて！', NEW.id, 'public', NOW(),NOW(), CURRENT_DATE, -0.4), 
        (POST_ID_3, E'【サンプル】\n冬に暖房つけずに外からの日差しだけで温まるの好き', NEW.id, 'public', NOW(),NOW(), CURRENT_DATE, 0.5), 
        (POST_ID_4, E'【サンプル】\n大学生ってみんな休日に何してるんだろう...?外出るだけでお金かかるのにそんなに外出したりできるの不思議じゃない？', NEW.id, 'public', NOW(), NOW(), CURRENT_DATE, -0.2);
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Failed to insert public.posts for user_id: %, Error: %', NEW.id, SQLERRM;
    END;

    -- Insert public.tags
    BEGIN
      INSERT INTO public.tags (id, name, user_id, created_at, updated_at)
      VALUES 
        (TAG_ID_1, 'チュートリアル', NEW.id, NOW(), NOW()),
        (TAG_ID_2, 'サンプル', NEW.id, NOW(), NOW());
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Failed to insert public.tags for user_id: %, Error: %', NEW.id, SQLERRM;
    END;

    -- Insert public.post_tags
    BEGIN
      INSERT INTO public.post_tags (post_id, tag_id, created_at, updated_at)
      VALUES
        (POST_ID_1, TAG_ID_1, NOW(), NOW()),
        (POST_ID_2, TAG_ID_1, NOW(), NOW()),
        (POST_ID_3, TAG_ID_2, NOW(), NOW()),
        (POST_ID_4, TAG_ID_2, NOW(), NOW());
      EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Failed to insert public.post_tags for user_id: %, Error: %', NEW.id, SQLERRM;
    END;

    RAISE NOTICE 'Successfully inserted for user_id: %', NEW.id;

    RETURN NEW;
  END;
END;
