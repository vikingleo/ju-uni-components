<template>
	<!--带搜索的地区选择器-->
	<view class="region-wrap" :style="{width}" :class="className">
		<view class="region-header">
			<view class="region-header-action-btn" v-if="close" @click="closePopup">
				<view v-if="$slots.close">
					<slot name="close"></slot>
				</view>
				<view v-else>
					<image style="width:30rpx;height:30rpx;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFGmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjItMDMtMTBUMTE6MzQ6MjUrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIyLTAzLTEwVDExOjM0OjQwKzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIyLTAzLTEwVDExOjM0OjQwKzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmEzMjljNzkxLTQ1ZDYt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">
					</image>
				</view>
			</view>
			<view class="region-header-title">
				<text v-text="title" v-if="title"></text>
				<template v-else>
					<slot name="title"></slot>
				</template>
			</view>

			<view class="region-header-action-btn" v-if="confirm||$slots.confirm" @click="confirmSelect">
				<view v-if="$slots.confirm">
					<slot name="confirm"></slot>
				</view>
				<view v-else>
					<image style="width:30rpx;height:30rpx;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFGmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjItMDMtMTBUMTE6MzM6MTIrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIyLTAzLTEwVDExOjM0OjE2KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIyLTAzLTEwVDExOjM0OjE2KzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjBmMzk0MGRjLTM2MzAtNGVjYS04ZWEyLTM3ZjM3MmQ0ZTk4ZiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowZjM5NDBkYy0zNjMwLTRlY2EtOGVhMi0zN2YzNzJkNGU5OGYiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowZjM5NDBkYy0zNjMwLTRlY2EtOGVhMi0zN2YzNzJkNGU5OGYiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjBmMzk0MGRjLTM2MzAtNGVjYS04ZWEyLTM3ZjM3MmQ0ZTk4ZiIgc3RFdnQ6d2hlbj0iMjAyMi0wMy0xMFQxMTozMzoxMiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKE1hY2ludG9zaCkiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Rnd/uAAAGzhJREFUeJztnXmcZFWZpp/3RGRmQQEFKAKCiqOAqD3T9IgL2N2i3eOCy7jguAMytugAUu6IOm4ISGGxKkujtkt3S6uguOuMjTQIKgojbuxrgbIvtWXmve/8cSJyqcqMzMo8mRkZ9T2/X0LmjYgvbkXc957znfMtsk0QBBOTFvoEgqCbCYEEQQdCIEHQgRBIEHQgBBIEHQiBBEEHQiBB0IEQSBB0IAQSBB0IgQRBB0IgQdCBEEgQdCAEEgQdCIEEQQdCIEHQgRBIEHQgBBIEHQiBBEEHQiBB0IEQSBB0IAQSBB0IgQRBB0IgQdCBEEgQdCAEEgQdCIEEQQdCIEHQgRBIEHRAT/7KI7ASfYOraQ6uZd2W21M1EwmTasBQ1zDcSNBM9A3V9K8RtzzrYdbuuZpnXAJ3rX8MvqefgftXs2ZgmC23HIbmAGvdxzDD9K2tcV3jVNPA1H39NJKAigrTHDJ13YAkUsPUMsKAsBOpMrapEziZBsYksFBtakxKYAkjEmCMaoPBSkiA8nFjVIERSEjO76bWeyKqWjy2+QCPaqxjKOp7dxVNwa2Dy7hzcBuWaD3VQJ2/u0rUJJKMPPpdkgwNGqrZSUN6Ui3+E7gviduQflvjm2RXOF8TThp9r4X7ZwbBvJGoeQZmX4vdgJ2BhuFu4C+Aa4BrgauB4bEvDIEEvUwDeCTwNGqOsvk7NDodMIAN4gHgh8AXgUuA+9rPCYEEvcyOwOHUHATsMOmzzNZGLwX2Bv4RWAFUEE560LvsAH4z+GDg0UBfh+cmYADxRMQrgL1ax0IgQU+yHXAIcCjZ39gUngocjNkROwQS9ByPAF5j9Haj3Wbw+iWC12HvRe2B8EGCXmIr4PmYo4FdZmgjYe8EfjJwdwgk6BkEBwh/GHjMbE1JPAvoC4EEPYHhlYLlgj2L2JMaiGYIJFjs9GH2BR1t9F/LmdXvBb8KgQSLnd1V6yzEHiWNNswqoZtiFStYpAjE3nXTX26JQ1O+ZHoMga8Efgu6NUaQDiSZpqBe6BPpAQS04k9bMR5TPXny5zWBpOrZNKr3IvYudIptHgB/AerfGw+GQCZBwPqqwUNuMFzs5rSZYmMlLEHtqe/1UwioYZ4yJB2T0vALip1jZi34x7K/bnwfOGKxJiPJ3De0hAervvzFBjNGNsPNPoYbfaS6ok41pBzGUdepFZSeVZHTGFoKGTfsjNAPnA3s25xyKNrUE+VywWmYO9sHQiAd8MhPCGR2uCWB0Z98dOPPduLPeuTYTsAXDU9T4W/F8k8FJwG/YkzIewikA60cK6aeNAedyJ/jeIlMdDzTvi0x5m8gx0i9D/j7ObhdXQacSg55Hxz7QAgkWAw8AVgOvKGw3SHgSuBE4MLW3+MIgQTdjMhh6h+ivDhq4LeYkxDfYoNMwjaxDxJ0M8vIfsELydmBxZC5RuZ04LtMIg6IESToXnYFDgO9CdimpGGja4VPBc4HHur03BBI0I3sBBwEHE5ZcZhcoOEMw1cED071ghBI0E20fY43AoeRp1ilMHAj6FzgLDZYrZqMEEjQTfQDhyAOZtNTZSdHkIa4J1Xpc1jnGgZlj0a9CCyPLuuPiS0KgQTdwlbAgeB3AE8qaThVuu++Pdeevnb74S9i7t1ob55RgeQ/Ro+HQIJuYCvgZcCRFBaHa+5Ma/SVB3cZPPOhXdf/aVNfHwIJFpo+4HlGhwN/WdCuEXdjzvdqjk+rdfdMjIRAgoUkAc8A3gXFw9arZF2oWscJ7p1puFAIJFhI9hP+KPAsCl+LtflXrFOacOtsohpDIMFCsR9mObB/YbtrQD+0darN/5utsQg1CeYbAU/CvMPWywvbXgv8B0qfRPpFCYMxggTzzTayPkGOryqMfwH+BKTflUpRjxEkmB/y5sOjLJ+JeCGwZUnzgkuFVwA/A1aXshsjyBRsjrmEG633tA/M4sMQ3g18JOI1M7cyqfGrMKeQczqKEgKZgnpMrtvmhAS2Wml/Yz+BsSqZaE96QrYHvx2q5SXPEahAN1v1ccAFmoMvKgQyCbnQQCNX49goz6x3saHZV5MaoqobKBmnVopsDVMKpBXgNP4Rv8/S2+bgAr4d+ePAj5kgG7AEIZApyCPI5jOGjM8G10ggH5BrtbWufLefLI3m7Y95bIydT4AOIoeTlOQ64BTgAuD+wrZHCIFMwebogxRie+BN5F3yJYVt3wCcSe4pOGVOx2wIgQRzwTLgtcDKwnZr4G6Zs4DPW3MrDgiBBHPDQcAxc2D3HltnCH+ZOZxWjSUEEpTm7cBhgkeVNau7gHPIXWhXlbU9OSGQoBRbAa8AjgJ2L2z7LuCfyAKZN3FACCQow9bAi4BP2LNuf7YhD4DPAz4Luqmw7SmJUJOgBC8AjrZm3DhzMh6U+AZwMnBTYdvTIkaQYLa8xPC/yLVzi91wDesR3xB8ErieBSqQHAIJZkoTeA7Z5/hrCopDeD3iq4jTBNeN04YZDf5plyEZqUjSPj76d7uDgvtm1gYpBBLMhAFgX+D94OcWtr22qhs/sDgZ8WsDdjtwRdiMRDa4prVz75GQsVzGp0Ft4VZpH5rQvH+A/ns2fds3BBLMhP8CHI5UOhtwHfCzwar/2KpuXqkCwVvrAbaGbX4zwNZXb7q9EEiwqTyZXBL07ym6yGNwuqyumx/B6Spm5HNs3NywXRguVUJ1jCDB3LInObbqZeSl3SK0JlAXST4Rp4uBDULsN8XSeEZ8kOQZyTkEEkyXvYC3WRxE2VYEteDKJJ8G/m63dfOKfZBgOuwIvBF0BGXFUWFuSniF5G92Yy/IGEGCqWjKOgLz5rJmBXBrrfqTSf4RHZrYLCQhkKATA5j3AYeQR5GS3IhYifka8EBh28UIgQSTsS3ya4GjKZ/wtAr5bMQ5mHWFbRclBBJMgBoSB0g+g/JJlcMSZyPOqelucUAIZEoM1O6ulZWxCI00gilxJctQk/4HcGwhk2OpE/o0+J8N9xa2PSd0Esg25F5xWwL3GG7b3Crg2KaZEv1L+hb6VCZGYrCqqOqKBlCrQd59NjZIY67viUQujayquqUywYEk3mt4XMlTNdwP+hK5/dkNJW3PJeMFkj/Ex8rsTd4xfRywNeKOBNdT+2bgN8Ct832iC4ENzYZY2tfXlXcGJVEP1tTDpoFwEkrQrjAyKhCPbi+04/nagX4j8Us0MfsI/jfmKYVP9V7gPGAFcEth23PKWIH0o7QLcLisQ2S2GymoJ2jaMOyHQKc5pz3eAlTzfsbzTHuK1ZUCqVv3tPZFPrbezoYn3Pl4E3ga5kvAEwqf5hDW+cBKtLjEAS2ByDVVc8khVWPJO1HaQfZ2kzx/a/BbMbvXfT5huMkV83iuwdyxL3CCYLfiluXzgDOxFs20aizNlh/2Sistd0p7yFPGzT+iGvBLl92whG0f9hkprb2I1I3312CaPFfwbswzC9tdL3yBc3G3K+i2GJJp0gR2Bx0K7DkNcQBQ9TGw1R39Bw78SVus3bFaXzXTL5O6cyc0mBSRw9bfRflWBKuB7wGfBor06VgoEnAoORBt2sjggYp1TT3//nuWHTe8Pu2TVHXpUk8wAU1yiuzxhucVvrUPIS5CnAL8vKzp+SeBdmamvRqkPolnNh9e87HmuvX7jltWDLoW5RviB22eTc4OLGn8MnKRhV8WtbtANMnD7LazsLEkDdfPqRoMDi9RPxU/KnNqwRzxnw1Hgg4Alha0a8TFwHHAT2kl8y12msCuQP+srEjN4eQXObmpIYYlLnWPfEA9xhPJlQ9fQ1FxqEJcbLES+P7IUVobkO3yCRrzQLsKvEb/zs9LrZ/umI00yZs42zHL3BDlXdi/o1/bWPqQzcWESLqFBnnTdznSayk7clRyfaXs0y2+NfYB2aSWStrNeLIO8sWSANdGav3YJA/TaBVp6AaJNIWvNnokWSSzJWH2HhpufFSN9HE1+P7iXNzrOXYG3gZ6LQVTZQEqpVsGBh86qW9o3fc26aveMH28HVCGWqHD3SAPaBr9CtiHMgIBGKjRM1XX77HocyrfNy7YJHYGvRV4PeW+YwAE1w006uObDH9HVb1mOms0E7U73OhYd2gDgKaWNr6fXO/uYb+yXs/SYt1zXT9XlRsNq8L8hNzDOphfHkVexj+YPIoUw/AHxGf6GvWXk1i/UXe2qV8/rWMLTWPZfktWVQ/Ud3vIu6YlejwFc44FuyV7L9XcUotbkYcT4EaDpDymGkg12Cm380rZcVPbAhopcNF26NIGj7U6gY1E4I34gmOCyUaC88Y9ptHH2i/fwG4jJfpTyTTsckhisK6o65qEsFLr32ABO0t6PfZRwKMLv/PtRmc7eWUzMayhQRiuuurOX4rGg5eu4/6frLuzesj3Lttvyd4ecuG+DmxPg6dYrKL2H5JCIKXoIJCtgAMFHySPIgUvXa8DzjB8BrG2L0HqZYHU60293lXfDo1V2/3tkhs86MeTl35L0QR2StJjE34Q87sQSBkmEYgEbwK9m7xyVfKyXaOk00DnGlYh6HWBjIS7p36txlxInmIdCfwt5coCSWJfGilZdUL6LvBwIdvBKIm8x3E4sEdh2/fJfAXpTMyNhW13LRNlFF4A1IYBwdOY7SZii5yLpWfSSB8GEvjbhEhKsiWwr80HoHjC08My58s63ub2wra7mslGiO8Dx4KuLv6O1h6qqw9jv3RkbhPMitau81+I+iThJ82B/QtNOhG4o7Ttbmdkcr3kcU2W7bsEDxqgAt0uuAl5N1DJtloNwQ7A44F1FleFDzIzJDFUVVTU+yjpRKR9KF4tU+eDThFcKXDbevvj22x8kAlYA3yH/M9+h2B/lyw7af7K5qgcb8C3mKe2vjMhf+8lVunFiBoLmFOO3fgr4GhLfzN7i+OogJ+AVgKXFLa9aJhO2Z9vt+LKmsCzKBgeLdibWh8CN8HfBN1TynYpjKlsrAL3BtdQ160AvvHM6OZr7WrxfqSXz/bUNmAt8DPZH7R8eU8ODdNkunWxfmAzbPiYxNNLnoBgt7qhD7mWlFv9dk1moiSquuJhwI2tQA1mduvPS9qNoYeoh9cznFqmBNStSV0S1GOePhKb1MKtwWd0urnUYgXmgFTYl5N8OfBJ3Bs5HbNhMh+Ekbm8jFBNdtBulNgNeGzBc0igbSV2lxiW+LXVvskurA+S/zJWwmkpVgO3Qrc37SeHb6dqPXU9TKX8r7bGlKtSu71Y67hGi5SMFCsZPbaLxXHAS5TrlxXDcAlipeDfMYNjP1MB4YNMzhpGY/2PUk7VLFeZUewFPqK1IvNvwN3FbM+SUR9kbF2dTcUjF9kGWt3o787nwRPIOR0HA6XTnK8gF1n4HpGqAMzsAv++Ritd/g2lChvnu+de4PcjGoKvGe4sYrt32An4B3Lb5ZLiGAKuBD4FfLP1d8DMR4AfGSrDUsF+Rc8IdqHmg+Sis+eSR64gL44cbvEGCm3ejuGPwBnA+WwGxQA3hZmumdfApcBHQRcVPB/IftGOtt5p6zBUvPT+YmQ74N2G15Ejc4vN9gXXK4vjW4Q4NmI2PsQa4Efk6dZqctfTYsO+YTfM21t/fhn4cynbi4xW+zPeBuxS2PZNZJ/j34D7CtvuCUo42T9urcUI9BxgiwI2W/gJmPcgGsBXWWSFjwuwPTn48AhUThzKJeCvMZwj+Bz5Bjfm8dYQtcHK4MixMb+n1o+nu9KwyCi1CvV/JGpgic3+hWy28I514hhqmsDZQNdtJs4R/cArgcMou6yOzSrgi8YnuzWtGl/b2iN/uJWSgMHObRXc+h2b2s5L7bNZ4OtiSjbQuQw41vlm8tyCdoVZRuJwsn9yCvBQQfvdyBLgQPJq1RNLGm420oN337f27PvuXXsujcl8jrFXusb91u4jkg+0QrPqanSTs8coKZC1wP8FaszDwAtQ0dWWRwvegiXkcw2renBEhxy2/grMu8hF/QriB9TQmYNV9fm1Dw39aUYeY3uBv/07TH8jZxFSugWbgZ8w+jE+j5mWNZ3IMjxWsLxl+yvA9UVsdw9bAC8iJzwVFgd/Ar5Bw6emBqtoUrbjeY8yVz0K/115btvvvLpVMgR7O1vHtBz3z5K/+F6Y/faR95SWA88obPth4HtJ6VjQqsK2e5rCuQNjEL8Ajrf58RwY78cchn0khWs9LQg5CuXpiA+1wtdL2qZO+lbdTMcDd/TErWQemcsut+uAi8jxqmuAF4GL+STK1ToOthDmsyzuJeD9MceQQ3fKYn0D6xTEH4vb3gyY6zbQJlf6bi8C/jdK1oUVO5Pn603yev7vi9meH0Ruf/YOyq78AazD/inWp/Hi79OxUMxXn/SLwRW4D/SCwu+7laR3Iws4nTySLIZFxwTsLmm54KVFLYsK80tqfxRzea+uMM0Hc+eDbMyvgE9J/gFz4FTbOsTmKHK++2Lg0ck6RvD84hewuUL448CVjviqWTFfIwhkn+QSctuvdcCLVba70fbAa2ULaSU5zqhbebzQe4CXAVuVNGz7l4iTlPekuiY7c7EynwKBPPX5j9b/a+AFFCzH33LcD8u/cg7wm1K2iyF2lThM8BbKf/5/MJwq+BqLY5rZ9cy3QNpcSu6K28QcQNn8hn7bRyAaiFMw19E9F8sWSrxZSe+g7GdfAbfbHEur8F9B25s1CyUQgKuAFRLJ5mXFrZvXYxrAscCtszfYSiRvu0/jYpKYwqvKT6iSj7D9P4XKNs6E2zDHkVNlV0/15GD6LKRA1gsuB04wWgf+74V9kmWWDiRf1SuAa2ZmJldWcLW6FQfeUkI9WuJqND7JG76y/Z8G9j+Y4UMpW4QPcrjNZ4DziJyO4iykQCBPDX7W+r/JcUglq3RsjzikVQ/wM8CvmdEKmnG1tjWItMpKVIwP2hsRyAbmE9uCXkbNB5B2LRzVdws5BeALhDjmhIUWSJufY60AEvJLKJp0RRP50Nb9/mTyZuKmr+4ojR8lJipNsrFAtgBeDPqIVbSlRA38WXC24fPkRqzBHDCf+yBT8RvwSvB35sK48auNlwO7zYX9SXgx5kib0tOqe40+Rx45NpcEsgVhuoXjRl4wko457lkeKbrWnm2MLUErjX99u2f26AwlT1oEdyBuEmwJ2oOyI1w/WRw7IK6VuWt6hePa55xGRo32YKGNRpBxvBR0FOgZFA0s171kcZypvPiw0ZRRY84RUi4XnnKjotQUD68eZPVDQ911e+xSukkgtB66XXAzaBtyh6SSVU22AJ6K2FpmFehOJBcWyBbkmLOjQc+m7GV4H+hL5DD/GyfzZkIg5ejWj+gKYIXhu5Svi9Un62DgCGBvyhZgGwD+GngvaN+Cdg3cj/V14FTguoK2gw50q0AAfgd8mlyvqTxJr0J6J0VblXkf4AjQs8rZBGAt8veA4zE3F7YddKBbVrEmYoi8LLsSMYQ5kMLTLckHkO/OK8ilN2fDPtnnYH8KRgYkqMDfAB+PPZJiXAOpXXEEcmJU65eRLc1W1ZFRW3m923WdP91InpqSbhYI5N2GnwMnkZdmXw5sW9D+MuDVZF/sdHJllk2Nfk3A04F3Ai+hZNiMPTTUSBfUapxq/NvxRak22MAfqdTjER/Ebb8w5RdUyciJxpZbsHTHFDnp06DbBdLmKkknAQ3br6BsBGwfuThbg3wTvgIYnOZrG8BfAm8HH1jwnADWkHTp+tRcMZiav5A9ekFPdOcf67G3H29/u+1RJAnXpm/rpTxiWdEg4p5lsQgE4I+Gky0l2W8obXxM0tJx5KnddHgM4q1zII4auMr9fR8T6deq64kiWcYz0WMbHcvTL9fGdcyvpkO3LfOOOb7hMdXAXcDNsvuQnkxZgTdbcVI7Id2cl4E7LvPuLPkDwKso3MQG+zLq+iP0Ny8ZloYqFw5QCabNYhJI29wq2dcjbancKbdkWMoAsAfSI2X+DNwuqCcQyOMxyyUOpqxPhMzPVdcnYV9IX7MaViIEsnAspinWWK4WPpF8ub6S7GyXok/2q8hiEdlxXzfm8ccBh0heXvA9IS8O3IB9qszXJmr0Gcw/3bwPMhXXGk62/fU5sS5eSF6ZGlunaqngdbLfOwfv+Ocan+C52vcJZsRiHUEgO7K/Iy/PDgMHUTafpCmxv/KOQRP4hfCbZb+t5Pu0JrSryIld36b3C3MvKhazQCBPS35NDmM3uSL69gXtbwUcAGwhfJHwq6FwZK65FfEZ4EuEOLqOxS6QNr8n74aLLJLtShl2To99oeT9KLuTD3CX4AuYM6wQRzeymH2QDble0kpJ582R/a0p3DxTiXOVOIdcXDroQnplBIHcA+la0GeNLPxmyl7QJdeV1kmcBfwT5jYiKqpr6SWBQPZJrgJWkp3411DWJynBfcC/kjtl3bjA5xJMQS9NscZyDfKJyF+lu1JS7zf6unNcWYhjEdCrAgG4SeLTSv6XhT6RNpYuRJxG73XG6ll6bYq1ITdiznJtSzoMFc0e3BQq0DeBM1h8LRo2a3pdIBVwNTlN1cDrgUfM7yl4HfAd0Kcg+nQsNnpdIG2uA1qxW7yG+WuRsBb4IdkhD3EsQnrZB9mQ28g57v/M/PTMsPDlyqPXxfPwfsEcsDkJBHIdqbNlTmWOe2c4ZyaeQI4GDhYpm8sUq01FDnA8o5WD8kbhRxazLqASrnWp4VjjHwPDeRcwMTaE3bSSPOqcEWvlY67JPzKuGtRqUFeRD7JQbG4CaXM9OXar7bjvWMKoKzn1V5c1lgyfYvNdtTbI2wIZi9oCcStlvCUQ1ZBsJMOAGVCiEU3UFozNVSAAq1q1gA06gly8YTY36ppK1zW2Xn96/y4Pn+dCE7jS0ZHBprG5+SAbsgo4R/LJzN5xv7M5UH2q0T/8bReMrIogrYVlcx5BIMdr/RE4K5dg06Ga2T7JjXXyymbTX5d4cKI2IbMhRLJwbO4CaXMDuThdE3gV5jHjKlVMzhDiD7X4l7rhfzSsJZLJe4oQyCh/RqwE7pR4tc0e5IzCyaahg+DLLc62uABYG7f63mNz90HG4dp3NJrpnIGlzbcopdNs7u/w7G8DxwDfJBKeepYYQcZTIe5PDV0J3CPpGiWeWptHq653tXSXpGsFt9m+HPgV4SL0NCGQCWitQt0qcSHid8DumD0RtwBXCG4xPECIo+eRS65JBkGPET5IEHQgBBIEHQiBBEEHQiBB0IEQSBB0IAQSBB0IgQRBB0IgQdCBEEgQdCAEEgQdCIEEQQdCIEHQgRBIEHQgBBIEHQiBBEEHQiBB0IEQSBB0IAQSBB0IgQRBB0IgQdCBEEgQdCAEEgQdCIEEQQdCIEHQgRBIEHQgBBIEHQiBBEEHQiBB0IH/D7TJQ5Btvr9MAAAAAElFTkSuQmCC"></image>
				</view>
			</view>
		</view>
		<!--        搜索框-->
		<view class="region-search-bar" v-if="showSearcher">
			<view class="region-search-prefix">
				<template v-if="$slots.searchLabel">
					<slot name="searchLabel"></slot>
				</template>
				<template v-else>
					<text v-text="searchLabel"></text>
				</template>
			</view>
			<input type="text" placeholder="如：深圳" class="region-search-input" v-model="keyword" @input="onSearchInputChange"></input>
		</view>
		<view class="hot-city" v-if="hotCity">
			<template v-if="$slots.hotCityHeader">
				<slot name="hotCityHeader"></slot>
			</template>
			<!-- <template v-else>
                <view class="hot-city-title">
                    热门城市
                </view>
            </template> -->

			<!-- <view class="hot-city-list">
                <view class="hot-city-item " v-for="(item,index) in 5" :key="index" @click="onClickHotCity(item)">
                    北京
                </view>
            </view> -->
		</view>
		<template v-if="searchCityProvince">
			<scroll-view scroll-y :style="{height:scrollHeight}">
				<view class="search-result-box">
					<view class="search-result-item" v-for="item in searchCityProvince.city.list" :key="item.id" @click="onSelectSearch(item)">
						{{ searchCityProvince.name }}-
						<text class="keyword" v-text="searchCityProvince.city.name"></text>
						-{{ item.name }}
					</view>
				</view>
			</scroll-view>
		</template>
		<template v-else>
			<view class="region-tabs">
				<view class="region-tabs-item" v-show="column>=1">省份</view>
				<view class="region-tabs-item" v-show="column>=2">城市</view>
				<view class="region-tabs-item" v-show="column>=3">区市</view>
			</view>
			<view class="region-scroll-view" :style="{height:scrollHeight}">
				<!--        省-->
				<view v-for="(item,index) in regionArray" class="region-scroll" :key="index" v-show="(index+1) <= column">
					<scroll-view scroll-y scroll-with-animation class="full-width" :scroll-into-view="selectedItem[index]&&selectedItem[index].id?'item-' +(selectedItem[index].id):''" :style="{height:scrollHeight}">
						<view class="region-body">
							<template v-if="item&&item.length">
								<view :id="'item-'+region_item.id" @click="chooseItem(region_item,region_index,index)" :class="{active:value[index]===region_item.id}" class="region-item" v-for="(region_item,region_index) in item" :key="region_index">
									<text v-text="region_item.name" class="region-item-text"></text>
								</view>
							</template>
							<view v-else class="region-list-empty region-item">请选择</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
	import { flatten, deepClone, debounce, getType } from '@/utils'


	export default {
		name: "ju-region-selector",
		props: {
			value: {
				type: Array,
				default() {
					return []
				}
			},
			//方向，和uni-popup一致
			title: {
				type: String,
				default: ''
			},
			searchLabel: {
				type: String,
				default: '城市：'
			},
			//方向，和uni-popup一致
			direction: {
				type: String,
				default: 'bottom'
			},
			// 内容区域的高度
			height: String,
			//设置内容区域的宽度
			width: {
				type: String,
				default: '100%'
			},
			//滚动区域的高度，建议用vh
			scrollHeight: {
				type: String,
				default: '30vh'
			},
			// 内容区域外框的样式名
			className: String,
			//是否显示
			show: {
				type: Boolean,
				default: true,
			},
			//是否显示热门城市
			hotCity: {
				type: Boolean,
				default: false,
			},
			// 自带请求函数，是否开启自动请求数据，和传入region二选一
			post: {
				type: Boolean,
				default: false,
			},
			// 显示关闭按钮
			close: {
				type: Boolean,
				default: true,
			},

			// 显示确认按钮
			confirm: {
				type: Boolean,
				default: true,
			},
			// 自定义传输数据组，和post二选一
			region: {
				type: Array,
				default() {
					return []
				}
			},
			//用于展示的名称字段名，默认name
			nameField: {
				type: String,
				default: 'name'
			},
			//项目里的子列表字段名
			childrenField: {
				type: String,
				default: 'list'
			},
			//  要显示省市县的多少列
			column: {
				type: Number,
				default: 3
			},
			// 精确等级 新加，兼容云税业务需求 3代表精确到省市区
			level: {
				type: Number,
				default: 3
			},
			// 是否显示搜索框
			showSearcher: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			show: function (newVal) {
				this.$refs['regionView'][newVal ? 'open' : 'close']()
			},
		},
		data() {
			return {
				columnActive: 0,
				regionData: [],
				selectedIndex: [],
				selectedItem: [],
				columnData: [],
				regionArray: [],
				keyword: '',
				searchCityProvince: null
			}
		},
		created() {
			if (this.post && !this.region.length && !this.regionData.length) {
				this.getRegionData()
			} else if (this.region && this.region.constructor === Array && this.region.length) {
				this.initRegionData(this.region)
			}
		},

		methods: {
			/**
			 * 获取数据
			 * @returns {Promise<void>}
			 */
			async getRegionData() {
				try {
					if (uni.getStorageSync('district_source')) {
						this.initRegionData(uni.getStorageSync('district_source'))
					} else {
						let res = await this.$request(this.$api.address.region, {
							login: false,
							header: {
								'X-Requested-With': 'XMLHttpRequest'
							}
						}).post()
						if (res.code === 0) {
							this.$emit('post', {
								type: 'select',
								data: res.data.district
							})
							uni.setStorageSync('district_source', res.data.district)
							this.initRegionData(res.data.district)
						}
					}
				} catch (err) {
					console.error(err)
				}
			},
			/**
			 * 关闭弹窗
			 * */
			closePopup() {

				this.$emit('close', {
					type: 'close'
				})
			},
			/**
			 * 选择列表中的项
			 * @param item
			 * @param index
			 * @param columnIndex
			 */
			chooseItem(item, index, columnIndex) {
				console.log(item, index, columnIndex)
				//切换时，如果当前索引是原来的内容，不处理，否则如果还有内容，则清除
				console.log('before', this.regionArray)
				let regionArray = [...this.regionArray].map((o, i) => i <= columnIndex ? o : [])
				console.log('after', regionArray)
				let value = [...this.value].map((o, i) => i <= columnIndex ? o : 0)
				value[columnIndex] = item.id
				console.log(columnIndex + 1 < this.column)
				if (columnIndex + 1 < this.column) {
					regionArray[columnIndex + 1] = item[this.childrenField]
				}
				this.regionArray = regionArray
				this.$emit('update:value', value)
				this.selectedItem = value.map((o, i) => {
					return regionArray[i].find(p => p.id === o) || null
				})
				this.selectedIndex = value.map((o, i) => {
					return regionArray[i].find(p => p.id === o) ? i : 0
				})
				this.$emit('select', {
					type: 'select',
					value,
					valueIndex: this.selectedIndex,
					current: item,
					columnIndex: columnIndex,
					selected: this.selectedItem,
					region: regionArray,
				})
				if (columnIndex + 1 === this.column) {
					this.closePopup()
				}
			},
			/**
			 * 初始化
			 * */
			initRegionData(data) {
				this.regionData = data
				let value = [...this.value]
				if (!value || !value.length) {
					value = [...Array.from(new Array(this.column))].map(o => 0)
				}
				console.log('init selectedItem', this.selectedItem)
				console.log('init value', value)
				let regionArray = []
				for (let i in value) {
					i = +i
					let val_item = value[i]
					if (i === 0) {
						regionArray[i] = data
						value[i] = val_item === 0 ? data[0]['id'] : val_item
					} else {
						let prev_arr = regionArray[i - 1]
						let prev_val = value[i - 1]
						let prev_item = prev_arr.find(o => String(o.id) === String(prev_val))

						console.log(prev_item)
						if (prev_item) {
							regionArray[i] = prev_item[this.childrenField]
							value[i] = val_item === 0 ? regionArray[i][0].id : val_item
						}
					}
				}

				console.log('after', value)
				console.log('after', regionArray)
				this.regionArray = [...regionArray]
				this.selectedItem = [...Array.from(new Array(this.column))].map(o => ({}))
				
				setTimeout(() => {
					this.selectedItem = this.value.map((o, i) => {
						return this.regionArray[i].find(p => p.id === o) || null
					})
				}, 500)

				this.selectedIndex = value.map((o, i) => {
					return regionArray[i].find(p => p.id === o) ? i : 0
				})
				this.$emit('update:value', value)
				this.$emit('init', {
					type: 'init',
					value,
					selected: this.selectedItem,
					valueIndex: this.selectedIndex,
					region: this.regionArray,
				})
			},
			/**
			 * 点击完成
			 * */
			onDone() {
				const that = this

				let res = {
					type: 'change',
					names: [],
					ids: [],
					column: this.columnActive,
					column_data: this.columnData,
					selected: this.value.map((o, i) => {
						return this.regionArray[i].find(p => p.id === o) || null
					}),
					multi_data: this.regionArray,
					region: this.regionArray,
					value: that.selectedIndex,
					distract: '',
				}
				let d = ['province', 'city', 'county']
				for (let i in that.selectedItem) {
					let item = that.selectedItem[i]
					res.ids.push(item.id)
					res.names.push(item[that.nameField])
					res.distract += item.name || ''
					res[d[i]] = item.name
				}
				that.closePopup()
				that.$emit('change', res)
			},
			/**
			 * 重置
			 */
			reset() {
				if (!this.selectedIndex.length) {
					return false
				}

				let res = {
					type: 'reset',
					names: [],
					ids: [],
					column: this.columnActive,
					column_data: this.columnData,
					multi_data: this.regionArray,
					region: this.regionArray,
				}
				this.$emit('reset', res)
				this.columnData = deepClone(this.regionData)
				this.regionArray = [deepClone(this.regionData)]
				this.columnActive = 0
				this.selectedIndex = []
				this.selectedItem = []
			},
			/**
			 * 点击热门
			 * @param item
			 */
			onClickHotCity(item) {
				this.$emit('hot-click', {
					type: 'hot-click',
					data: item
				})
			},
			/**
			 * 搜索输入框变更时
			 * @param e
			 */
			onSearchInputChange: debounce(function () {
				if (!this.keyword) {
					this.searchCityProvince = null
					return false
				}
				let all_district = flatten(this.regionData, [], 'list')
				let item = all_district.find(o => o.name.indexOf(this.keyword) > -1 && o.level === 'city')
				if (!item) {
					this.searchCityProvince = null
					return false
				}

				let province = deepClone(this.regionData.find(o => o.id === item.parent_id))
				province.city = item
				this.searchCityProvince = province
				this.$emit('search-change', this.keyword)
			}, 1000),
			/**
			 * 选择搜索结果
			 */
			onSelectSearch(item) {
				let province_index = this.regionData.findIndex(o => o.id === this.searchCityProvince.id)
				let province = this.regionData[province_index]
				let city_index = province.list.findIndex(o => o.id === this.searchCityProvince.city.id)
				let city = province.list[city_index]
				let district_index = city.list.findIndex(o => o.id === item.id)
				this.selectedIndex = [province_index, city_index, district_index]
				this.selectedItem = [province, city, item]
				this.searchCityProvince = null
				this.chooseItem(item, district_index, 2)
			},
			/**
			 * 确认，返回已选
			 */
			confirmSelect() {

				let res = {
					type: 'confirm',
					value: this.value,
					selected: this.selectedItem,
					valueIndex: this.selectedIndex,
					region: this.regionArray,
				}
				this.closePopup()
				this.$emit('confirm', res)
			}
		}
	}
</script>

<style lang="scss" scoped>
// 使用时直接 width:units(50)=50x2rpx，最终结果：100rpx
@function units($val) {
	@return $val * 2rpx;
}

$rpx20: units(20);

.region-scroll {
	flex: 1;

	&-view {
		display: flex;
		align-items: stretch;
	}
}

.region {
	&-list-empty {
		font-size: units(12);
		color: #a2a2a2;
		text-align: center;
	}

	&-wrap {
		background-color: #fff;
		padding: {
			left: units(20);
			right: units(20);
			bottom: var(--window-bottom);
		}
	}

	&-header {
		display: flex;
		align-items: center;
		justify-content: space-between;

		&-action-btn,
		&-title {
			padding: units(15) 0;
		}
		&-title {
			flex: 1;
			text-align: center;
		}
	}

	&-search {
		&-bar {
			display: flex;
			align-items: center;
			border: 1px solid #8f8f8f;
			margin-bottom: units(20);
			padding: {
				left: units(5);
				right: units(5);
			}
		}

		&-prefix {
			padding: {
				left: units(5);
				right: units(5);
			}
		}

		&-input {
			height: units(43);

			padding: {
				left: units(5);
				right: units(5);
			}
		}
	}

	&-body {
		padding: units(10);
	}

	&-tabs {
		display: flex;
		align-items: center;
		background-color: #fff;

		&-item {
			position: relative;
			flex: 1;
			text-align: center;
			font-size: units(12);
			margin-bottom: units(15);
			font-weight: 500;

			&:active {
				background-color: #eee;
			}

			&.active {
				border-bottom-color: $uni-color-primary;
			}
		}
	}

	&-item {
		text-align: center;
		color: #a2a2a2;

		&:active {
			opacity: 0.8;
		}

		&-text {
			display: inline-block;
		}

		&.active {
			color: #000;

			.region-item-text {
				border-bottom-color: $uni-color-primary;
			}
		}

		+ .region-item {
			margin-top: units(15);
		}
	}
}

.hot-city {
	padding-bottom: 20px;
	border-bottom: 1px solid #e7e7e7;
	margin-bottom: 20px;

	&-title {
		font-size: units(12);
		color: #a2a2a2;

		margin: {
			bottom: units(5);
			top: units(30);
		}
	}

	&-list {
		display: flex;
		align-items: center;
		margin: units(-10);
		flex-wrap: wrap;
	}

	&-item {
		padding: units(4) units(10);
		border: 1px solid #8f8f8f;
		margin: units(10);
		font-size: units(12);

		&:active {
			opacity: 0.5;
		}
	}
}

.search-result-box {
	padding-left: units(30);

	.search-result-item {
		border-bottom: 1px solid #e7e7e7;
		padding: {
			top: units(10);
			bottom: units(10);
		}
		color: #8f8f8f;

		.keyword {
			color: #c0162a;
		}

		&:active {
			opacity: 0.5;
		}
	}
}
</style>
