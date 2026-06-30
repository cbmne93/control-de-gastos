"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import {
    ArrowLeft,
    CalendarClock,
    CalendarDays,
    CircleDollarSign,
    CreditCard,
    FolderTree,
    Hash,
    ListChecks,
    Save,
} from "lucide-react";

import type {
    MovimientoActionState,
    MovimientoCategoriaOption,
    MovimientoCuentaOption,
    MovimientoFormDefaultValues,
    TipoMovimientoValue,
} from "@/features/movimientos/types/movimiento.types";

type MovimientoFormAction = (
    prevState: MovimientoActionState,
    formData: FormData,
) => Promise<MovimientoActionState>;

interface MovimientoFormProps {
    action: MovimientoFormAction;
    categorias: MovimientoCategoriaOption[];
    cuentas: MovimientoCuentaOption[];
    defaultValues?: MovimientoFormDefaultValues;
    submitLabel?: string;
}

const initialState: MovimientoActionState = {
    success: false,
};

const inputClassName =
    "h-11 w-full rounded-xl border border-(--app-border) bg-(--app-card) px-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-(--app-primary) focus:ring-4 focus:ring-(--app-primary-soft)";

const labelClassName =
    "flex items-center gap-2 text-sm font-semibold text-slate-700";

const labelIconClassName = "h-4 w-4 text-(--app-primary)";

function SubmitButton({ label }: { label: string }) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-(--app-primary) px-5 text-sm font-bold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
            <Save className="h-4 w-4" />
            {pending ? "Guardando..." : label}
        </button>
    );
}

function FieldError({ errors }: { errors?: string[] }) {
    if (!errors?.length) {
        return null;
    }

    return (
        <p className="mt-1.5 text-sm font-medium text-rose-600">
            {errors[0]}
        </p>
    );
}

function getTodayInputDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getInitialFormValues(defaultValues?: MovimientoFormDefaultValues) {
    return {
        tipo: defaultValues?.tipo ?? "GASTO",
        fecha: defaultValues?.fecha ?? getTodayInputDate(),
        monto: defaultValues?.monto ?? "",
        descripcion: defaultValues?.descripcion ?? "",
        cuentaId: defaultValues?.cuentaId ?? "",
        categoriaId: defaultValues?.categoriaId ?? "",
        tieneCuotas: defaultValues?.tieneCuotas ?? false,
        cantidadCuotas: String(defaultValues?.cantidadCuotas ?? "2"),
        fechaPrimerVencimiento: defaultValues?.fechaPrimerVencimiento ?? "",
    };
}

export function MovimientoForm({
    action,
    categorias,
    cuentas,
    defaultValues,
    submitLabel = "Guardar movimiento",
}: MovimientoFormProps) {
    const [state, formAction] = useActionState(action, initialState);

    const [formValues, setFormValues] = useState(() =>
        getInitialFormValues(defaultValues),
    );

    const categoriasFiltradas = useMemo(() => {
        return categorias.filter(
            (categoria) => categoria.tipo === formValues.tipo,
        );
    }, [categorias, formValues.tipo]);

    const handleTipoChange = (value: TipoMovimientoValue) => {
        setFormValues((currentValues) => ({
            ...currentValues,
            tipo: value,
            categoriaId: "",
            tieneCuotas: value === "GASTO" ? currentValues.tieneCuotas : false,
        }));
    };

    return (
        <form action={formAction} className="space-y-6">
            {state.errors?.general?.length ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                    {state.errors.general[0]}
                </div>
            ) : null}

            <div className="overflow-hidden rounded-3xl border border-(--app-border) bg-(--app-card) shadow-sm">
                <div className="border-b border-(--app-border) px-5 py-4 sm:px-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-(--app-primary-soft) text-(--app-primary) ring-1 ring-(--app-primary-muted)">
                                <ListChecks className="h-5 w-5" />
                            </div>

                            <div>
                                <h2 className="text-base font-bold leading-none text-foreground">
                                    Datos del movimiento
                                </h2>

                                <p className="mt-1.5 text-sm text-slate-500">
                                    Cargá la información principal del ingreso o
                                    gasto.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 p-5 sm:p-6">
                    <div className="grid gap-5 lg:grid-cols-3">
                        <div className="space-y-2">
                            <label htmlFor="tipo" className={labelClassName}>
                                <FolderTree className={labelIconClassName} />
                                Tipo de movimiento
                            </label>

                            <select
                                id="tipo"
                                name="tipo"
                                value={formValues.tipo}
                                onChange={(event) =>
                                    handleTipoChange(
                                        event.target
                                            .value as TipoMovimientoValue,
                                    )
                                }
                                className={inputClassName}
                            >
                                <option value="GASTO">Gasto</option>
                                <option value="INGRESO">Ingreso</option>
                            </select>

                            <FieldError errors={state.errors?.tipo} />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="fecha" className={labelClassName}>
                                <CalendarDays className={labelIconClassName} />
                                Fecha
                            </label>

                            <input
                                id="fecha"
                                name="fecha"
                                type="date"
                                value={formValues.fecha}
                                onChange={(event) =>
                                    setFormValues((currentValues) => ({
                                        ...currentValues,
                                        fecha: event.target.value,
                                    }))
                                }
                                className={inputClassName}
                            />

                            <FieldError errors={state.errors?.fecha} />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="monto" className={labelClassName}>
                                <CircleDollarSign
                                    className={labelIconClassName}
                                />
                                Monto
                            </label>

                            <input
                                id="monto"
                                name="monto"
                                type="text"
                                inputMode="numeric"
                                value={formValues.monto}
                                onChange={(event) =>
                                    setFormValues((currentValues) => ({
                                        ...currentValues,
                                        monto: event.target.value,
                                    }))
                                }
                                placeholder="Ej.: 150.000"
                                className={inputClassName}
                            />

                            <FieldError errors={state.errors?.monto} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="descripcion"
                            className="text-sm font-semibold text-slate-700"
                        >
                            Descripción
                        </label>

                        <input
                            id="descripcion"
                            name="descripcion"
                            type="text"
                            value={formValues.descripcion}
                            onChange={(event) =>
                                setFormValues((currentValues) => ({
                                    ...currentValues,
                                    descripcion: event.target.value,
                                }))
                            }
                            placeholder="Ej.: Supermercado, salario, combustible..."
                            className={inputClassName}
                        />

                        <FieldError errors={state.errors?.descripcion} />
                    </div>

                    <div className="grid gap-5 lg:grid-cols-2">
                        <div className="space-y-2">
                            <label
                                htmlFor="cuentaId"
                                className={labelClassName}
                            >
                                <CreditCard className={labelIconClassName} />
                                Cuenta
                            </label>

                            <select
                                id="cuentaId"
                                name="cuentaId"
                                value={formValues.cuentaId}
                                onChange={(event) =>
                                    setFormValues((currentValues) => ({
                                        ...currentValues,
                                        cuentaId: event.target.value,
                                    }))
                                }
                                className={inputClassName}
                            >
                                <option value="">Seleccionar cuenta</option>

                                {cuentas.map((cuenta) => (
                                    <option key={cuenta.id} value={cuenta.id}>
                                        {cuenta.nombre}
                                    </option>
                                ))}
                            </select>

                            <FieldError errors={state.errors?.cuentaId} />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="categoriaId"
                                className={labelClassName}
                            >
                                <FolderTree className={labelIconClassName} />
                                Categoría
                            </label>

                            <select
                                id="categoriaId"
                                name="categoriaId"
                                value={formValues.categoriaId}
                                onChange={(event) =>
                                    setFormValues((currentValues) => ({
                                        ...currentValues,
                                        categoriaId: event.target.value,
                                    }))
                                }
                                className={inputClassName}
                            >
                                <option value="">Seleccionar categoría</option>

                                {categoriasFiltradas.map((categoria) => (
                                    <option
                                        key={categoria.id}
                                        value={categoria.id}
                                    >
                                        {categoria.nombre}
                                    </option>
                                ))}
                            </select>

                            {categoriasFiltradas.length === 0 ? (
                                <p className="text-sm font-medium text-amber-600">
                                    No tenés categorías activas para este tipo
                                    de movimiento.
                                </p>
                            ) : null}

                            <FieldError errors={state.errors?.categoriaId} />
                        </div>
                    </div>

                    {formValues.tipo === "GASTO" ? (
                        <div className="space-y-4">
                            <label className="flex items-start gap-3 rounded-2xl border border-(--app-border) bg-(--app-card-soft) px-4 py-3">
                                <input
                                    name="tieneCuotas"
                                    type="checkbox"
                                    checked={formValues.tieneCuotas}
                                    onChange={(event) =>
                                        setFormValues((currentValues) => ({
                                            ...currentValues,
                                            tieneCuotas: event.target.checked,
                                        }))
                                    }
                                    className="mt-1 h-4 w-4 rounded border-slate-300 accent-(--app-primary)"
                                />

                                <span>
                                    <span className="block text-sm font-bold text-slate-800">
                                        Este gasto tendrá cuotas
                                    </span>
                                    <span className="mt-1 block text-sm text-slate-500">
                                        Se generarán vencimientos mensuales a
                                        partir de la fecha indicada.
                                    </span>
                                </span>
                            </label>

                            <FieldError errors={state.errors?.tieneCuotas} />

                            {formValues.tieneCuotas ? (
                                <div className="rounded-2xl border border-(--app-primary-muted) bg-(--app-primary-soft) p-4">
                                    <div className="mb-4">
                                        <h3 className="text-sm font-bold text-foreground">
                                            Plan de cuotas
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-600">
                                            Indicá la cantidad de cuotas y el
                                            primer vencimiento.
                                        </p>
                                    </div>

                                    <div className="grid gap-5 lg:grid-cols-2">
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="cantidadCuotas"
                                                className={labelClassName}
                                            >
                                                <Hash
                                                    className={
                                                        labelIconClassName
                                                    }
                                                />
                                                Cantidad de cuotas
                                            </label>

                                            <input
                                                id="cantidadCuotas"
                                                name="cantidadCuotas"
                                                type="number"
                                                min={2}
                                                step={1}
                                                value={
                                                    formValues.cantidadCuotas
                                                }
                                                onChange={(event) =>
                                                    setFormValues(
                                                        (currentValues) => ({
                                                            ...currentValues,
                                                            cantidadCuotas:
                                                                event.target
                                                                    .value,
                                                        }),
                                                    )
                                                }
                                                className={inputClassName}
                                            />

                                            <FieldError
                                                errors={
                                                    state.errors
                                                        ?.cantidadCuotas
                                                }
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label
                                                htmlFor="fechaPrimerVencimiento"
                                                className={labelClassName}
                                            >
                                                <CalendarClock
                                                    className={
                                                        labelIconClassName
                                                    }
                                                />
                                                Primer vencimiento
                                            </label>

                                            <input
                                                id="fechaPrimerVencimiento"
                                                name="fechaPrimerVencimiento"
                                                type="date"
                                                value={
                                                    formValues.fechaPrimerVencimiento
                                                }
                                                onChange={(event) =>
                                                    setFormValues(
                                                        (currentValues) => ({
                                                            ...currentValues,
                                                            fechaPrimerVencimiento:
                                                                event.target
                                                                    .value,
                                                        }),
                                                    )
                                                }
                                                className={inputClassName}
                                            />

                                            <FieldError
                                                errors={
                                                    state.errors
                                                        ?.fechaPrimerVencimiento
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link
                    href="/movimientos"
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-(--app-border) bg-(--app-card) px-5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-(--app-primary-muted) hover:bg-(--app-primary-soft) hover:text-(--app-primary) sm:w-auto"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver
                </Link>

                <SubmitButton label={submitLabel} />
            </div>
        </form>
    );
}