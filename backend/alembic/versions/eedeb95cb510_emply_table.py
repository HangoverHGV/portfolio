"""Emply table

Revision ID: eedeb95cb510
Revises: 69953af09750
Create Date: 2025-02-12 16:53:25.326569

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'eedeb95cb510'
down_revision: Union[str, None] = '69953af09750'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
