package com.x.portal.assemble.surface.jaxrs.page;

import com.x.base.core.container.EntityManagerContainer;
import com.x.base.core.container.factory.EntityManagerContainerFactory;
import com.x.base.core.project.cache.Cache.CacheKey;
import com.x.base.core.project.cache.CacheManager;
import com.x.base.core.project.http.ActionResult;
import com.x.base.core.project.http.EffectivePerson;
import com.x.base.core.project.logger.Logger;
import com.x.base.core.project.logger.LoggerFactory;
import com.x.base.core.project.tools.ListTools;
import com.x.portal.assemble.surface.Business;
import com.x.portal.core.entity.*;
import org.apache.commons.lang3.StringUtils;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.TreeMap;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

class V2GetWithPortal extends BaseAction {

	private static Logger logger = LoggerFactory.getLogger(V2GetWithPortal.class);

	ActionResult<Wo> execute(EffectivePerson effectivePerson, String flag, String portalFlag) throws Exception {
		ActionResult<Wo> result = new ActionResult<>();
		Wo wo = null;
		CacheKey cacheKey = new CacheKey(this.getClass(), flag, portalFlag);
		Optional<?> optional = CacheManager.get(cacheCategory, cacheKey);
		if (optional.isPresent()) {
			wo = (Wo) optional.get();
			try (EntityManagerContainer emc = EntityManagerContainerFactory.instance().create()) {
				Business business = new Business(emc);
				Portal portal = business.portal().pick(portalFlag);
				if (null == portal) {
					throw new ExceptionPortalNotExist(portalFlag);
				}
				if (isNotLoginPage(flag) && (!business.portal().visible(effectivePerson, portal))) {
					throw new ExceptionPortalAccessDenied(effectivePerson.getDistinguishedName(), portal.getName(),
							portal.getId());
				}
			}
		} else {
			wo = this.get(flag, portalFlag, effectivePerson);
			CacheManager.put(cacheCategory, cacheKey, wo);
		}
		result.setData(wo);
		return result;
	}

	private Wo get(String flag, String portalFlag, EffectivePerson effectivePerson) throws Exception {
		Page page = null;
		try (EntityManagerContainer emc = EntityManagerContainerFactory.instance().create()) {
			Business business = new Business(emc);
			Portal portal = business.portal().pick(portalFlag);
			if (null == portal) {
				throw new ExceptionPortalNotExist(portalFlag);
			}
			if (isNotLoginPage(flag) && (!business.portal().visible(effectivePerson, portal))) {
				throw new ExceptionPortalAccessDenied(effectivePerson.getDistinguishedName(), portal.getName(),
						portal.getId());
			}
			page = business.page().pick(portal, flag);
			if (null == page) {
				throw new ExceptionPageNotExist(flag);
			}
		}
		Wo wo = new Wo();
		final PageProperties properties = page.getProperties();
		wo.setPage(new RelatedPage(page, page.getDataOrMobileData()));
		final List<String> list = new CopyOnWriteArrayList<>();
		CompletableFuture<Map<String, RelatedWidget>> _relatedWidget = CompletableFuture.supplyAsync(() -> {
			Map<String, RelatedWidget> map = new TreeMap<>();
			if (ListTools.isNotEmpty(properties.getRelatedWidgetList())) {
				try (EntityManagerContainer emc = EntityManagerContainerFactory.instance().create()) {
					Business bus = new Business(emc);
					Widget _f;
					for (String _id : properties.getRelatedWidgetList()) {
						_f = bus.widget().pick(_id);
						if (null != _f) {
							map.put(_id, new RelatedWidget(_f, _f.getDataOrMobileData()));
							list.add(_f.getId() + _f.getUpdateTime().getTime());
						}
					}
				} catch (Exception e) {
					logger.error(e);
				}
			}
			return map;
		});
		CompletableFuture<Map<String, RelatedScript>> _relatedScript = CompletableFuture.supplyAsync(() -> {
			Map<String, RelatedScript> map = new TreeMap<>();
			if ((null != properties.getRelatedScriptMap())
					&& (properties.getRelatedScriptMap().size() > 0)) {
				try (EntityManagerContainer emc = EntityManagerContainerFactory.instance().create()) {
					Business bus = new Business(emc);
					for (Entry<String, String> entry : properties.getRelatedScriptMap().entrySet()) {
						switch (entry.getValue()) {
							case RelatedScript.TYPE_PROCESSPLATFORM:
								com.x.processplatform.core.entity.element.Script _pp = bus.process().script().pick(entry.getKey());
								if (null != _pp) {
									map.put(entry.getKey(), new RelatedScript(_pp.getId(), _pp.getName(), _pp.getAlias(),
											_pp.getText(), entry.getValue()));
									list.add(_pp.getId() + _pp.getUpdateTime().getTime());
								}
								break;
							case RelatedScript.TYPE_CMS:
								com.x.cms.core.entity.element.Script _cms = bus.cms().script().pick(entry.getKey());
								if (null != _cms) {
									map.put(entry.getKey(), new RelatedScript(_cms.getId(), _cms.getName(), _cms.getAlias(),
											_cms.getText(), entry.getValue()));
									list.add(_cms.getId() + _cms.getUpdateTime().getTime());
								}
								break;
							case RelatedScript.TYPE_PORTAL:
								Script _p = bus.script().pick(entry.getKey());
								if (null != _p) {
									map.put(entry.getKey(), new RelatedScript(_p.getId(), _p.getName(), _p.getAlias(),
											_p.getText(), entry.getValue()));
									list.add(_p.getId() + _p.getUpdateTime().getTime());
								}
								break;
							default:
								break;
						}
					}
				} catch (Exception e) {
					logger.error(e);
				}
			}
			return map;
		});
		list.add(page.getId() + page.getUpdateTime().getTime());
		List<String> sortList = list.stream().sorted().collect(Collectors.toList());
		wo.setFastETag(StringUtils.join(sortList, "#"));
		wo.setRelatedWidgetMap(_relatedWidget.get());
		wo.setRelatedScriptMap(_relatedScript.get());
		return wo;
	}

	public static class Wo extends AbstractWo {

	}

}