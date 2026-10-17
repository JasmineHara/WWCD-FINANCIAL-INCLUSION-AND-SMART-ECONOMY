CREATE SEQUENCE "public"."Post_id_seq" AS integer INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1 NO CYCLE;

CREATE SEQUENCE "public"."User_id_seq" AS integer INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1 NO CYCLE;

CREATE TABLE "public"."Post" (
  "id"        integer                        NOT NULL DEFAULT nextval('public."Post_id_seq"'::regclass),
  "title"     text                           NOT NULL,
  "content"   text                           NOT NULL,
  "createdAt" timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) without time zone NOT NULL,
  "authorId"  integer                        NOT NULL,
  CONSTRAINT "Post_pkey" PRIMARY KEY (id)
);

CREATE TABLE "public"."User" (
  "id"        integer                        NOT NULL DEFAULT nextval('public."User_id_seq"'::regclass),
  "name"      text                           NOT NULL,
  "email"     text                           NOT NULL,
  "password"  text                           NOT NULL,
  "createdAt" timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) without time zone NOT NULL,
  "image"     text,
  CONSTRAINT "User_pkey" PRIMARY KEY (id)
);

ALTER SEQUENCE "public"."Post_id_seq" OWNED BY "public"."Post"."id";

ALTER SEQUENCE "public"."User_id_seq" OWNED BY "public"."User"."id";

ALTER TABLE "public"."Post"
  ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."Post_id_seq" TO "anon", "authenticated";

REVOKE ALL ON SEQUENCE "public"."Post_id_seq" FROM "postgres";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."Post_id_seq" TO "postgres";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."Post_id_seq" TO "service_role";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."User_id_seq" TO "anon", "authenticated";

REVOKE ALL ON SEQUENCE "public"."User_id_seq" FROM "postgres";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."User_id_seq" TO "postgres";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."User_id_seq" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."Post" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."Post" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."Post" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."Post" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."User" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."User" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."User" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."User" TO "service_role";
