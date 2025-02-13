"""Emply table

Revision ID: 69953af09750
Revises: 76c77e711570
Create Date: 2025-02-12 16:53:22.096746

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '69953af09750'
down_revision: Union[str, None] = '76c77e711570'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
