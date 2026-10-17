import {createServerClient} from "@supabase/ssr";
import {cookies} from "next/headers";   

function getEnvironmentVariable(){
    const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseURL || !supabaseAnonKey) {
        throw Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.");
    }
    return { supabaseURL, supabaseAnonKey };
}

export async function createSupabaseServerClient() {
    const { supabaseURL, supabaseAnonKey } = getEnvironmentVariable();
    const cookieStore= await cookies();
    return createServerClient(supabaseURL, supabaseAnonKey, {
        cookies: {
            getAll(){
                return cookieStore.getAll();
            },
            setAll(cookiesToSet){
                try{
                    cookiesToSet.forEach(({name, value, options}) =>
                        cookieStore.set(name, value, options)
                    );
                } catch (error) {
                    console.log(error)
            }
            }
    }
});
}