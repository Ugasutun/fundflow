<script lang="ts">
  let { error, status } = $props();

  const title = $derived(
    status === 404 ? 'Page not found' : 'Something went wrong'
  );
  const description = $derived(
    status === 404
      ? "The page you were looking for doesn't exist, or the link is out of date."
      : error?.message ?? 'An unexpected error interrupted this request.'
  );

  function handleBack() {
    history.back();
  }
</script>

<svelte:head>
  <title>{status} · {title} · FundFlow</title>
</svelte:head>

<section class="error-shell">
  <div class="error-card fade-up">
    <p class="eyebrow">FundFlow status</p>
    <div class="status-badge">{status}</div>
    <h1>{title}</h1>
    <p class="description">{description}</p>

    <div class="actions">
      <a class="primary-action" href="/">Back to homepage</a>
      <button class="secondary-action" type="button" onclick={handleBack}>
        Go back
      </button>
    </div>
  </div>
</section>

<style>
  .error-shell {
    min-height: calc(100vh - 140px);
    display: grid;
    place-items: center;
    padding: 3rem 0;
  }

  .error-card {
    width: min(100%, 680px);
    padding: 3rem;
    border-radius: 28px;
    border: 1px solid var(--color-accent-border);
    background:
      radial-gradient(circle at top, var(--color-brand-glow), transparent 48%),
      linear-gradient(180deg, var(--color-card-bg), var(--color-card-bg-hover));
    box-shadow: 0 24px 80px rgba(2, 6, 23, 0.18);
    text-align: center;
  }

  .eyebrow {
    margin-bottom: 1rem;
    color: var(--color-text-muted);
    font-size: 0.78rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 5rem;
    margin-bottom: 1.25rem;
    padding: 0.45rem 0.9rem;
    border-radius: 999px;
    border: 1px solid var(--color-accent-border-emphasis);
    background: var(--color-accent-bg);
    color: var(--color-accent);
    font-size: 0.95rem;
    font-weight: 600;
    font-family: var(--font-mono);
  }

  h1 {
    margin: 0 0 1rem;
    color: var(--color-heading);
    font-size: clamp(2.4rem, 7vw, 4.5rem);
    line-height: 0.95;
    letter-spacing: -0.04em;
  }

  .description {
    margin: 0 auto;
    max-width: 34rem;
    color: var(--color-text-secondary);
    font-size: 1rem;
    line-height: 1.7;
  }

  .actions {
    display: flex;
    justify-content: center;
    gap: 0.9rem;
    flex-wrap: wrap;
    margin-top: 2rem;
  }

  .primary-action,
  .secondary-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 11rem;
    padding: 0.8rem 1.2rem;
    border-radius: 12px;
    font-size: 0.9rem;
    font-family: var(--font-mono);
    text-decoration: none;
    cursor: pointer;
    transition: transform 0.12s ease, border-color 0.12s ease, background 0.12s ease, color 0.12s ease;
  }

  .primary-action {
    border: 1px solid var(--color-accent-border-emphasis);
    background: var(--color-accent);
    color: var(--color-text-on-accent);
  }

  .primary-action:hover {
    background: var(--color-accent-hover);
    transform: translateY(-1px);
  }

  .secondary-action {
    border: 1px solid var(--color-border-muted);
    background: transparent;
    color: var(--color-text);
  }

  .secondary-action:hover {
    border-color: var(--color-accent-border-hover);
    background: var(--color-hover-overlay);
    transform: translateY(-1px);
  }

  @media (max-width: 640px) {
    .error-card {
      padding: 2rem 1.25rem;
      border-radius: 22px;
    }

    .actions {
      flex-direction: column;
    }

    .primary-action,
    .secondary-action {
      width: 100%;
    }
  }
</style>
