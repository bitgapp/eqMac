//
//  EQM_VolumeControl.h
//  EQMDriver
//
//  
//

#ifndef EQMDriver__EQM_VolumeControl
#define EQMDriver__EQM_VolumeControl

// Superclass Includes
#include "EQM_Control.h"

// PublicUtility Includes
#include "CAVolumeCurve.h"
#include "CAMutex.h"


#pragma clang assume_nonnull begin

class EQM_VolumeControl
:
    public EQM_Control
{

#pragma mark Construction/Destruction

public:
                        EQM_VolumeControl(AudioObjectID inObjectID,
                                          AudioObjectID inOwnerObjectID,
                                          AudioObjectPropertyScope inScope = kAudioObjectPropertyScopeOutput,
                                          AudioObjectPropertyElement inElement =
                                                  kAudioObjectPropertyElementMaster);

#pragma mark Property Operations

    virtual bool        HasProperty(AudioObjectID inObjectID,
                                    pid_t inClientPID,
                                    const AudioObjectPropertyAddress& inAddress) const;
    virtual bool        IsPropertySettable(AudioObjectID inObjectID,
                                           pid_t inClientPID,
                                           const AudioObjectPropertyAddress& inAddress) const;
    virtual UInt32      GetPropertyDataSize(AudioObjectID inObjectID,
                                            pid_t inClientPID,
                                            const AudioObjectPropertyAddress& inAddress,
                                            UInt32 inQualifierDataSize,
                                            const void* inQualifierData) const;
    virtual void        GetPropertyData(AudioObjectID inObjectID,
                                        pid_t inClientPID,
                                        const AudioObjectPropertyAddress& inAddress,
                                        UInt32 inQualifierDataSize,
                                        const void* inQualifierData,
                                        UInt32 inDataSize,
                                        UInt32& outDataSize,
                                        void* outData) const;
    virtual void        SetPropertyData(AudioObjectID inObjectID,
                                        pid_t inClientPID,
                                        const AudioObjectPropertyAddress& inAddress,
                                        UInt32 inQualifierDataSize,
                                        const void* inQualifierData,
                                        UInt32 inDataSize,
                                        const void* inData);

#pragma mark Accessors
  
  /*!
   @return The curve used by this control to convert volume values from scalar into signal gain
   and/or decibels. A continuous 2D function.
   */
  CAVolumeCurve&      GetVolumeCurve() { return mVolumeCurve; }
  
  /*!
   Set the volume of this control to a given position along its volume curve. (See
   GetVolumeCurve.)
   
   Passing 1.0 sets the volume to the maximum and 0.0 sets it to the minimum. The gain/loss the
   control applies (and/or reports to apply) to the audio it controls is given by the y-position
   of the curve at the x-position inNewVolumeScalar.
   
   In general, since the control's volume curve will be applied to the given value, it should be
   linearly related to a volume input by the user.
   
   @param inNewVolumeScalar The volume to set. Will be clamped to [0.0, 1.0].
   */
  void                SetVolumeScalar(Float32 inNewVolumeScalar);
  /*!
   Set the volume of this control in decibels.
   
   @param inNewVolumeDb The volume to set. Will be clamped to the minimum/maximum dB volumes of
   the control. See GetVolumeCurve.
   */
  void                SetVolumeDb(Float32 inNewVolumeDb);
  
  /*!
   Set this volume control to apply its volume to audio data, which allows clients to call
   ApplyVolumeToAudioRT. When this is set true, WillApplyVolumeToAudioRT will return true. Set to
   false initially.
   */
  void                SetWillApplyVolumeToAudio(bool inWillApplyVolumeToAudio);
  
#pragma mark IO Operations
  
  /*!
   @return True if clients should use ApplyVolumeToAudioRT to apply this volume control's volume
   to their audio data while doing IO.
   */
  bool                WillApplyVolumeToAudioRT() const;
  /*!
   Apply this volume control's volume to the samples in ioBuffer. That is, increase/decrease the
   volumes of the samples by the current volume of this control.
   
   @param ioBuffer The audio sample buffer to process.
   @param inBufferFrameSize The number of sample frames in ioBuffer. The audio is assumed to be in
   stereo, i.e. two samples per frame. (Though, hopefully we'll support
   more at some point.)
   @throws CAException If SetWillApplyVolumeToAudio hasn't been used to set this control to apply
   its volume to audio data.
   */
  void                ApplyVolumeToAudioRT(Float32* ioBuffer, UInt32 inBufferFrameSize) const;

#pragma mark Implementation

protected:
    void                SetVolumeRaw(SInt32 inNewVolumeRaw);

private:
    const SInt32        kDefaultMinRawVolume = 0;
    const SInt32        kDefaultMaxRawVolume = 96;
    const Float32       kDefaultMinDbVolume  = -96.0f;
    const Float32       kDefaultMaxDbVolume  = 0.0f;

    CAMutex             mMutex;

    SInt32              mVolumeRaw;
    SInt32              mMinVolumeRaw;
    SInt32              mMaxVolumeRaw;
    Float32             mMinVolumeDb;
    Float32             mMaxVolumeDb;

    CAVolumeCurve       mVolumeCurve;
  // The gain (or loss) to apply to an audio signal to increase/decrease its volume by the current
  // volume of this control.
  Float32             mAmplitudeGain;
  
  bool                mWillApplyVolumeToAudio;
};

#pragma clang assume_nonnull end

#endif /* EQMDriver__EQM_VolumeControl */

