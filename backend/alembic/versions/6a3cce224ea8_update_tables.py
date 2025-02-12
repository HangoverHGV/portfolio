"""update tables

Revision ID: 6a3cce224ea8
Revises: 42cc530395fc
Create Date: 2025-02-12 18:26:42.253266

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6a3cce224ea8'
down_revision: Union[str, None] = '42cc530395fc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
