-- First create the admin user in auth.users
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Create admin user in auth.users
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        phone,
        phone_confirmed_at,
        created_at,
        updated_at,
        raw_user_meta_data,
        raw_app_meta_data
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        NULL,
        NULL,
        NULL,
        '+9647705449905',
        NOW(),
        NOW(),
        NOW(),
        jsonb_build_object(
            'phone', '+9647705449905',
            'role', 'admin',
            'full_name', 'Dr. Ali Kamal',
            'created_at', NOW(),
            'updated_at', NOW()
        ),
        jsonb_build_object(
            'provider', 'phone',
            'providers', ARRAY['phone']
        )
    )
    RETURNING id INTO admin_user_id;

    -- Create admin profile in profiles table
    INSERT INTO public.profiles (
        id,
        full_name,
        phone,
        role,
        created_at,
        updated_at,
        payment_status,
        payment_approval_status
    )
    VALUES (
        admin_user_id,
        'Dr. Ali Kamal',
        '+9647705449905',
        'admin',
        NOW(),
        NOW(),
        'paid',
        'approved'
    );
END $$; 