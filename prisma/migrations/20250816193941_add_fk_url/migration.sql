-- AddForeignKey
ALTER TABLE "public"."visit" ADD CONSTRAINT "visit_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "public"."url"("id") ON DELETE CASCADE ON UPDATE CASCADE;
