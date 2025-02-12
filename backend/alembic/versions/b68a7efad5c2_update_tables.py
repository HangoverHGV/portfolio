"""update tables

Revision ID: b68a7efad5c2
Revises: 2e6876b7f900
Create Date: 2025-02-12 18:41:50.498536

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b68a7efad5c2'
down_revision: Union[str, None] = '2e6876b7f900'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
