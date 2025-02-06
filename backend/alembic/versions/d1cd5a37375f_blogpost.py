"""BlogPost

Revision ID: d1cd5a37375f
Revises: e950fbb15068
Create Date: 2025-02-06 09:38:11.261854

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd1cd5a37375f'
down_revision: Union[str, None] = 'e950fbb15068'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
