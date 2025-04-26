import React from 'react'

const MediaDigest=({mediadiItemDetails})=> {
  return (
    <>
    <div class="modal fade reschduleModal" id="mediaDigestPop" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header border-0">
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mediaPopupData">
          <h5 className="description">
            {mediadiItemDetails?.title}
          </h5>
          <div>{mediadiItemDetails?.description}</div>
          </div>
        </div>
      </div>
     </div>
  </div>
    </>
  )
}

export default MediaDigest