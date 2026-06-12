"""Initial schema

Revision ID: 001
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "001"
down_revision = None


def upgrade():
    # Tables created via SQLAlchemy metadata in dev; migration documents schema intent.
    pass


def downgrade():
    pass
