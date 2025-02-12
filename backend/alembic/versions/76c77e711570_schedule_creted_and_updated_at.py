"""Schedule creted and updated at

Revision ID: 76c77e711570
Revises: 59d99d374427
Create Date: 2025-02-12 11:04:09.737845

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '76c77e711570'
down_revision: Union[str, None] = '59d99d374427'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
