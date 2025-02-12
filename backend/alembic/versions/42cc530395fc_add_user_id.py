"""add user_id

Revision ID: 42cc530395fc
Revises: 552a789b5407
Create Date: 2025-02-12 17:02:06.430822

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '42cc530395fc'
down_revision: Union[str, None] = '552a789b5407'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
