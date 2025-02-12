"""Management tables

Revision ID: 59d99d374427
Revises: 6ba44dad60d3
Create Date: 2025-02-12 10:56:42.305990

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '59d99d374427'
down_revision: Union[str, None] = '6ba44dad60d3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
