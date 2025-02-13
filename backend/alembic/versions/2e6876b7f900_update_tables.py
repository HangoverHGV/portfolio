"""update tables

Revision ID: 2e6876b7f900
Revises: 6a3cce224ea8
Create Date: 2025-02-12 18:40:19.242302

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2e6876b7f900'
down_revision: Union[str, None] = '6a3cce224ea8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
