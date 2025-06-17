# Stage 1: Builder with virtual environment
FROM python:3.13-alpine AS builder

# Install build dependencies
RUN apk add --no-cache \
    gcc \
    musl-dev \
    postgresql-dev \
    libffi-dev

# Create virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python dependencies with exact versions
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Runtime image
FROM python:3.13-alpine

# Install runtime dependencies
RUN apk add --no-cache libpq curl

# Create non-root user
RUN adduser -D -u 1001 -g 0 fastapi && \
    chmod -R g=u /opt && \
    chown -R 1001:0 /opt

# Copy virtual environment
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Set workdir and copy app
WORKDIR /app
COPY --chown=1001:0 . .

# Security hardening
USER 1001
EXPOSE 8080

# Healthcheck and resource limits
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8080/health || exit 1

# Start command with worker auto-scaling
CMD ["sh", "-c", "uvicorn app.main:app \
  --host 0.0.0.0 \
  --port 8080 \
  --no-server-header \
  --workers ${UVICORN_WORKERS:-$(($(nproc) + 1))}"]