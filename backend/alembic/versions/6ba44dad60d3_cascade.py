"""cascade

Revision ID: 6ba44dad60d3
Revises: d1cd5a37375f
Create Date: 2025-02-07 13:25:14.334682

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6ba44dad60d3'
down_revision: Union[str, None] = 'd1cd5a37375f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
