-- Create a temporary table to store the migration results
CREATE TEMP TABLE migration_results (
    phone text,
    old_id uuid,
    new_id uuid,
    status text,
    error text
);

-- Create a function to handle the migration
CREATE OR REPLACE FUNCTION migrate_users_to_auth()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
    profile_record RECORD;
    auth_user_id uuid;
BEGIN
    -- Loop through each profile
    FOR profile_record IN 
        SELECT *  -- Select all fields from profiles
        FROM public.profiles
        WHERE phone IS NOT NULL
        AND phone NOT IN (
            SELECT COALESCE(raw_user_meta_data->>'phone', phone)
            FROM auth.users
            WHERE phone IS NOT NULL
        )
    LOOP
        BEGIN
            -- Create auth user with phone number and all profile data in metadata
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
                profile_record.phone,
                NOW(),
                NOW(),
                NOW(),
                jsonb_build_object(
                    'phone', profile_record.phone,
                    'role', profile_record.role,
                    'full_name', profile_record.full_name,
                    'gender', profile_record.gender,
                    'age', profile_record.age,
                    'complaint', profile_record.complaint,
                    'payment_status', profile_record.payment_status,
                    'payment_method', profile_record.payment_method,
                    'payment_approval_status', profile_record.payment_approval_status,
                    'payment_date', profile_record.payment_date,
                    'created_at', profile_record.created_at,
                    'updated_at', profile_record.updated_at
                ),
                jsonb_build_object(
                    'provider', 'phone',
                    'providers', ARRAY['phone']
                )
            )
            RETURNING id INTO auth_user_id;

            -- Store the result
            INSERT INTO migration_results (phone, old_id, new_id, status)
            VALUES (profile_record.phone, profile_record.id, auth_user_id, 'success');

            -- Update the profile id to match the new auth user id
            UPDATE public.profiles 
            SET id = auth_user_id 
            WHERE id = profile_record.id;

            -- Update any related records in other tables
            UPDATE public.messages SET user_id = auth_user_id WHERE user_id = profile_record.id;
            UPDATE public.medical_reports SET user_id = auth_user_id WHERE user_id = profile_record.id;
            UPDATE public.calls 
            SET 
                caller_id = CASE WHEN caller_id = profile_record.id THEN auth_user_id ELSE caller_id END,
                receiver_id = CASE WHEN receiver_id = profile_record.id THEN auth_user_id ELSE receiver_id END
            WHERE caller_id = profile_record.id OR receiver_id = profile_record.id;
            UPDATE public.call_signals 
            SET 
                from_user = CASE WHEN from_user = profile_record.id THEN auth_user_id ELSE from_user END,
                to_user = CASE WHEN to_user = profile_record.id THEN auth_user_id ELSE to_user END
            WHERE from_user = profile_record.id OR to_user = profile_record.id;

        EXCEPTION WHEN OTHERS THEN
            -- Store the error
            INSERT INTO migration_results (phone, old_id, status, error)
            VALUES (profile_record.phone, profile_record.id, 'error', SQLERRM);
        END;
    END LOOP;
END;
$$;

-- Run the migration
SELECT migrate_users_to_auth();

-- View the results
SELECT * FROM migration_results;

-- Clean up
DROP FUNCTION migrate_users_to_auth();
DROP TABLE migration_results; 