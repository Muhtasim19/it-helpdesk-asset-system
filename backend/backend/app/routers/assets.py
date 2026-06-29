from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.asset import Asset
from app.schemas.asset import AssetCreate,AssetUpdate, AssetResponse
from app.utils.dependencies import get_current_user, get_current_admin

from typing import List


router = APIRouter(prefix="/assets", tags=["Assets"])


@router.post("/", response_model=AssetResponse)
def create_asset(
    asset: AssetCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    new_asset = Asset(
        name=asset.name,
        category=asset.category,
        serial_number=asset.serial_number,
        status=asset.status,
        assigned_to=asset.assigned_to
    )

    db.add(new_asset)
    db.commit()
    db.refresh(new_asset)

    return new_asset

@router.get("/", response_model=List[AssetResponse])
def get_assets(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return db.query(Asset).all()

@router.get("/{asset_id}", response_model=AssetResponse)
def get_asset(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()

    if asset is None:
        raise HTTPException(
            status_code=404,
            detail="Asset not found"
        )

    return asset


@router.put("/{asset_id}", response_model=AssetResponse)
def update_asset(
    asset_id: int,
    updated_asset: AssetUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_admin)
):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()

    if asset is None:
        raise HTTPException(
            status_code=404,
            detail="Asset not found"
        )

    asset.name = updated_asset.name
    asset.category = updated_asset.category
    asset.serial_number = updated_asset.serial_number
    asset.status = updated_asset.status
    asset.assigned_to = updated_asset.assigned_to

    db.commit()
    db.refresh(asset)

    return asset


@router.delete("/{asset_id}")
def delete_asset(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_admin)
):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()

    if asset is None:
        raise HTTPException(
            status_code=404,
            detail="Asset not found"
        )

    db.delete(asset)
    db.commit()

    return {
        "message": "Asset deleted successfully"
    }