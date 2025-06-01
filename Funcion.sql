CREATE OR REPLACE FUNCTION public.registrar_cambio_costo_ruta()
RETURNS TRIGGER AS $$
BEGIN
    -- Comprobar si el costo_actual realmente cambió.
    -- OLD se refiere al valor de la fila ANTES de la actualización.
    -- NEW se refiere al valor de la fila DESPUÉS de la actualización.
    IF NEW.costo_actual IS DISTINCT FROM OLD.costo_actual THEN
        INSERT INTO public.cambio_costo (id_ruta, fecha_cambio, monto)
        VALUES (NEW.id_ruta, CURRENT_DATE, NEW.costo_actual);
    END IF;

    -- El valor de retorno para un trigger AFTER es ignorado,
    -- pero es buena práctica retornarlo. Para triggers BEFORE,
    -- retornar NEW permite que la operación continúe.
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;