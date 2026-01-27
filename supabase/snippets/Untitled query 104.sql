DO $$
DECLARE
  step_record RECORD;
BEGIN
  FOR step_record IN 
    SELECT rs.id, rs.title, rs.description
    FROM public.roadmap_steps rs
    JOIN public.roles r ON rs.role_id = r.id
    WHERE r.name = 'UX/UI Designer'
    ORDER BY rs.order_number
  LOOP
    INSERT INTO public.step_tasks (step_id, order_number, title, description, estimated_hours)
    VALUES (
      step_record.id,
      1,
      step_record.title,
      step_record.description,
      NULL
    );
  END LOOP;

  RAISE NOTICE 'Successfully inserted tasks for UX/UI Designer steps';
END $$;