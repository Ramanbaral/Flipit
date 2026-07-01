import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDropzone } from 'react-dropzone';
import {
  AlignLeft,
  Camera,
  ChevronDown,
  Info,
  Plus,
  Tag,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/create-listing')({
  component: CreateListingPage,
});

/* ── Schema ─────────────────────────────────────────────────────── */

const schema = z
  .object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    category: z.string().min(1, 'Please select a category'),
    condition: z.enum(['new', 'like-new', 'good', 'fair'], {
      error: 'Please select a condition',
    }),
    description: z
      .string()
      .min(20, 'Description must be at least 20 characters'),
    listingType: z.enum(['fixed', 'auction']),
    price: z.string().optional(),
    startingBid: z.string().optional(),
  })
  .refine(
    (d) =>
      d.listingType !== 'fixed' ||
      (d.price !== undefined &&
        d.price.trim() !== '' &&
        parseFloat(d.price) > 0),
    { message: 'Enter a valid selling price', path: ['price'] }
  )
  .refine(
    (d) =>
      d.listingType !== 'auction' ||
      (d.startingBid !== undefined &&
        d.startingBid.trim() !== '' &&
        parseFloat(d.startingBid) > 0),
    { message: 'Enter a valid starting bid', path: ['startingBid'] }
  );

type FormData = z.infer<typeof schema>;

const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Automotive',
  'Sports & Outdoors',
  'Books & Media',
  'Music & Instruments',
  'Art & Collectibles',
  'Other',
];

const CONDITIONS: {
  value: FormData['condition'];
  label: string;
  hint: string;
}[] = [
  { value: 'new', label: 'New', hint: 'Unused, original packaging' },
  { value: 'like-new', label: 'Like New', hint: 'Used once, no defects' },
  { value: 'good', label: 'Good', hint: 'Minor wear, fully functional' },
  { value: 'fair', label: 'Fair', hint: 'Visible wear, works fine' },
];

/* ── Shared input class ─────────────────────────────────────────── */

const inputCls = (hasError: boolean) =>
  cn(
    'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-foreground outline-none transition-all',
    'placeholder:text-muted-foreground/60',
    'focus:border-primary/70 focus:ring-2 focus:ring-primary/15',
    hasError
      ? 'border-destructive/70 focus:border-destructive focus:ring-destructive/15'
      : 'border-border'
  );

/* ── Section wrapper ─────────────────────────────────────────────── */

function Section({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="flex items-start gap-3 border-b border-border px-6 py-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">{title}</p>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

/* ── Field wrapper ───────────────────────────────────────────────── */

function Field({
  label,
  error,
  children,
  required,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1 text-xs font-semibold text-foreground">
        {label}
        {required && <span className="text-destructive">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

/* ── Photo grid ──────────────────────────────────────────────────── */

function PhotoSlot({
  preview,
  isCover,
  isEmpty,
  onRemove,
  className,
}: {
  preview: string | null;
  isCover?: boolean;
  isEmpty?: boolean;
  onRemove: () => void;
  className?: string;
}) {
  if (preview) {
    return (
      <div
        className={cn('group relative overflow-hidden rounded-xl', className)}
      >
        <img src={preview} alt="" className="h-full w-full object-cover" />
        {isCover && (
          <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
            Cover photo
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors',
        isEmpty
          ? 'border-border/50 bg-muted/20'
          : 'cursor-pointer border-border bg-muted/30 hover:border-primary/50 hover:bg-primary/5',
        className
      )}
    >
      {!isEmpty &&
        (isCover ? (
          <>
            <Camera className="h-7 w-7 text-muted-foreground/40" />
            <p className="mt-2 text-xs font-medium text-muted-foreground/60">
              Add cover photo
            </p>
          </>
        ) : (
          <Plus className="h-5 w-5 text-muted-foreground/40" />
        ))}
    </div>
  );
}

function PhotoGrid({
  files,
  onChange,
  error,
}: {
  files: File[];
  onChange: (files: File[]) => void;
  error?: string;
}) {
  const MAX = 5;

  const previews = useMemo(
    () => files.map((f) => URL.createObjectURL(f)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files.length]
  );

  useEffect(() => {
    return () => previews.forEach(URL.revokeObjectURL);
  }, [previews]);

  const onDrop = useCallback(
    (accepted: File[]) => {
      onChange([...files, ...accepted].slice(0, MAX));
    },
    [files, onChange]
  );

  const remove = (idx: number) => {
    onChange(files.filter((_, i) => i !== idx));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/png': [], 'image/jpeg': [], 'image/webp': [] },
    maxSize: 10 * 1024 * 1024,
  });

  const slots = Array.from({ length: MAX }, (_, i) => ({
    preview: previews[i] ?? null,
    isEmpty: i >= files.length + 1 && i >= 1,
  }));

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={cn(
          'grid h-72 cursor-pointer grid-cols-4 grid-rows-2 gap-2 rounded-xl transition-all',
          isDragActive && 'ring-2 ring-primary ring-offset-2'
        )}
      >
        <input {...getInputProps()} />
        <PhotoSlot
          preview={slots[0].preview}
          isCover
          isEmpty={false}
          onRemove={() => remove(0)}
          className="col-span-2 row-span-2"
        />
        {slots.slice(1).map((slot, i) => (
          <PhotoSlot
            key={i + 1}
            preview={slot.preview}
            isEmpty={slot.isEmpty}
            onRemove={() => remove(i + 1)}
          />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          PNG, JPG, WEBP · max 10 MB each
        </p>
        <p className="text-xs font-medium text-muted-foreground">
          {files.length} / {MAX} photos
        </p>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */

function CreateListingPage() {
  const [imageError, setImageError] = useState<string | undefined>();
  const [images, setImages] = useState<File[]>([]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      category: '',
      description: '',
      listingType: 'fixed',
      price: '',
      startingBid: '',
    },
  });

  const listingType = watch('listingType');

  const onSubmit = async (data: FormData) => {
    if (images.length === 0) {
      setImageError('Upload at least one photo');
      return;
    }
    setImageError(undefined);
    console.log('Listing data:', { ...data, images });
    // TODO: connect to API
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="border-b border-border bg-white">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Create Listing
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            List your item for sale or auction in minutes.
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-5xl px-6 py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* ── Left column ── */}
            <div className="space-y-5">
              {/* Section 1: Item details */}
              <Section icon={Tag} title="Item Details">
                <div className="space-y-4">
                  <Field
                    label="Listing Title"
                    error={errors.title?.message}
                    required
                  >
                    <input
                      {...register('title')}
                      placeholder="e.g., Vintage Leica M3 Camera"
                      className={inputCls(!!errors.title)}
                    />
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Category"
                      error={errors.category?.message}
                      required
                    >
                      <div className="relative">
                        <select
                          {...register('category')}
                          defaultValue=""
                          className={cn(
                            inputCls(!!errors.category),
                            'appearance-none pr-9'
                          )}
                        >
                          <option value="" disabled>
                            Select a category
                          </option>
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </Field>

                    <Field
                      label="Condition"
                      error={errors.condition?.message}
                      required
                    >
                      <Controller
                        name="condition"
                        control={control}
                        render={({ field }) => (
                          <div className="grid grid-cols-2 gap-1.5">
                            {CONDITIONS.map(({ value, label }) => (
                              <button
                                key={value}
                                type="button"
                                onClick={() => field.onChange(value)}
                                className={cn(
                                  'rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-all',
                                  field.value === value
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border bg-white text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-foreground'
                                )}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        )}
                      />
                      {errors.condition && (
                        <p className="mt-1 text-xs text-destructive">
                          {errors.condition.message}
                        </p>
                      )}
                    </Field>
                  </div>

                  <Field
                    label="Description"
                    error={errors.description?.message}
                    required
                  >
                    <textarea
                      {...register('description')}
                      rows={5}
                      placeholder="Describe your item in detail — condition, history, what's included..."
                      className={cn(
                        inputCls(!!errors.description),
                        'resize-none'
                      )}
                    />
                  </Field>
                </div>
              </Section>

              {/* Section 2: Photos */}
              <Section
                icon={Camera}
                title="Photos"
                subtitle="Add up to 5 photos. The first photo will be used as the cover."
              >
                <PhotoGrid
                  files={images}
                  onChange={(files) => {
                    setImages(files);
                    if (files.length > 0) setImageError(undefined);
                  }}
                  error={imageError}
                />
              </Section>

              {/* Section 3: Description tip */}
              <Section icon={AlignLeft} title="Writing tips">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    'Be specific about the model, year, and any serial numbers.',
                    'Mention all defects, scratches, or missing accessories.',
                    "Include what's in the box — cables, manuals, cases.",
                    'A longer, honest description builds buyer trust and reduces disputes.',
                  ].map((tip) => (
                    <li key={tip} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </Section>
            </div>

            {/* ── Right column: sticky sidebar ── */}
            <div className="lg:sticky lg:top-[88px] lg:self-start">
              <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                {/* Header */}
                <div className="border-b border-border px-5 py-4">
                  <p className="text-sm font-bold text-foreground">
                    Listing Type & Pricing
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Choose how you want to sell.
                  </p>
                </div>

                <div className="space-y-5 px-5 py-5">
                  {/* Toggle */}
                  <Controller
                    name="listingType"
                    control={control}
                    render={({ field }) => (
                      <div className="flex overflow-hidden rounded-xl bg-muted p-1">
                        {(['fixed', 'auction'] as const).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => field.onChange(type)}
                            className={cn(
                              'flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all duration-150',
                              field.value === type
                                ? 'bg-white text-foreground shadow-sm ring-1 ring-border/60'
                                : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            {type === 'fixed' ? 'Fixed Price' : 'Auction'}
                          </button>
                        ))}
                      </div>
                    )}
                  />

                  {/* Price / Starting bid */}
                  {listingType === 'fixed' ? (
                    <Field
                      label="Selling Price"
                      error={errors.price?.message}
                      required
                    >
                      <div
                        className={cn(
                          'flex items-center rounded-lg border bg-white px-3.5 py-2.5 transition-all focus-within:border-primary/70 focus-within:ring-2 focus-within:ring-primary/15',
                          errors.price
                            ? 'border-destructive/70 focus-within:border-destructive focus-within:ring-destructive/15'
                            : 'border-border'
                        )}
                      >
                        <span className="mr-1.5 text-sm font-medium text-muted-foreground">
                          $
                        </span>
                        <input
                          {...register('price')}
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
                        />
                      </div>
                    </Field>
                  ) : (
                    <div className="space-y-3">
                      <Field
                        label="Starting Bid"
                        error={errors.startingBid?.message}
                        required
                      >
                        <div
                          className={cn(
                            'flex items-center rounded-lg border bg-white px-3.5 py-2.5 transition-all focus-within:border-primary/70 focus-within:ring-2 focus-within:ring-primary/15',
                            errors.startingBid
                              ? 'border-destructive/70 focus-within:border-destructive focus-within:ring-destructive/15'
                              : 'border-border'
                          )}
                        >
                          <span className="mr-1.5 text-sm font-medium text-muted-foreground">
                            $
                          </span>
                          <input
                            {...register('startingBid')}
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
                          />
                        </div>
                      </Field>

                      <div className="flex gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3.5">
                        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        <div>
                          <p className="text-xs font-bold text-foreground">
                            24-Hour Hammer Rule
                          </p>
                          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                            Auctions close exactly 24 hours after the first bid.
                            Be ready to move fast.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Seller tip */}
                  <div className="rounded-xl bg-muted/60 px-4 py-3">
                    <p className="text-[11px] font-semibold text-foreground">
                      FlipIt seller fee: 4%
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Charged only when your item sells. Listing is always free.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2.5 border-t border-border px-5 py-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl py-2.5 text-sm font-bold cursor-pointer"
                  >
                    {isSubmitting ? 'Publishing…' : 'Publish Listing'}
                  </Button>
                  <button
                    type="button"
                    className="w-full rounded-xl border border-border py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                  >
                    Save as Draft
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
